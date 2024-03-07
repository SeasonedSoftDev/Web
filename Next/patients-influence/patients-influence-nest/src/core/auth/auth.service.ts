import {
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JsonWebTokenError } from 'jsonwebtoken';
import { UsersService } from '../../core/users/users.service';
import { passwordValid } from './utils/password.util';
import { UserNotFoundException } from '../users/exceptions/user.exception';
import { InvalidPasswordException } from './exceptions/password.exception';
import { User } from '@prisma/client';
import {
  IJWTPayload,
  IUserJwtPayload,
} from './interfaces/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { I18nService } from 'nestjs-i18n';
import { MailService } from 'src/integrations/mail/mail.service';
import sendgridConfig from 'src/config/sendgrid.config';
import { ConfigType } from '@nestjs/config';
import { Hash, UserRole, UserStatus } from 'src/utils';
import { userIdentity } from '../users/utils/user-identity';
import { ResendEmailConfirmationDto } from './dto/resend-email-confirmation.dto';
import { PrismaService } from '../../integrations/prisma/prisma.service';
import { EmailConfirmationDto } from './dto/email-confirmation.dto';
import { generateAffiliateLink } from 'src/utils/generators/affiliate-link.generator';
import securityConfig from 'src/config/security.config';
import { ForbiddenApplicationException } from 'src/exceptions/application.exception';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly mailService: MailService,
    private readonly prismaService: PrismaService,
    @Inject(sendgridConfig.KEY)
    private readonly _sendgridConfig: ConfigType<typeof sendgridConfig>,
    @Inject(securityConfig.KEY)
    private readonly _securityConfig: ConfigType<typeof securityConfig>,
    private readonly i18n: I18nService,
  ) {}

  async validateUser(email: string, password: string) {
    try {
      const user = await this.usersService.findOne(
        { email: email.toLowerCase() },
        true,
      );

      // check if password is correct
      await passwordValid(password, user.password, true, email);
      // ! user.password = undefined;

      if (user.isDeleted) {
        throw new ForbiddenApplicationException(
          'You have been removed from the application',
        );
      }

      // user is found, but check if he confirmed its account
      if (
        user.role !== UserRole.SuperAdmin &&
        user.role !== UserRole.Admin &&
        user.status <= UserStatus.Unconfirmed // less than makes no sens but leave it
      ) {
        throw new UnauthorizedException(
          this.i18n.t('_.error.message.login.pleaseConfirm', {
            // ! language can be pulled from user settings in future
            lang: undefined,
          }),
          {
            description: JSON.stringify({
              emailResendTokens: user.emailResendTokens,
            }),
          },
        );
      }

      return user;
    } catch (err) {
      if (
        err instanceof UserNotFoundException ||
        err instanceof InvalidPasswordException
      ) {
        // write down user's try to log-in and return generic response
        this.logger.warn(`Invalid login: ${err.message}`);
        throw new UnauthorizedException(
          this.i18n.t('_.error.message.login.incorrect', {
            // ! it is not possible to get language here
            lang: undefined,
          }),
        );
      }

      throw err;
    }
  }

  async login(user: User) {
    try {
    } catch (err) {
      // write down user's try to log-in and return generic response
      this.logger.warn(err.message);
      throw err;
    }

    const payload: IJWTPayload = {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };

    return {
      accessToken: await this.jwtService.signAsync(payload, {
        subject: user.id.toString(),
      }),
    };
  }

  async resetPassword(email: string, options?: { language: string }) {
    try {
      this.logger.verbose(
        `User ${userIdentity({ email })} requested password update`,
      );

      // confirm that user exists
      const user = await this.usersService.findOne({ email }, true);

      const payload: IUserJwtPayload = { id: user.id, email };
      const token = await this.jwtService.signAsync(payload, {
        subject: user.id.toString(),
        expiresIn: '30m',
      });
      const returnUrl = `${this._sendgridConfig.returnUrls.passwordReset}?token=${token}`;
      const passwordResetLink = `${this._securityConfig.protocol}://${[
        this._securityConfig.appSubdomain,
        this._securityConfig.baseDomain,
      ]
        .filter((d) => d !== undefined)
        .join('.')}${returnUrl}`;

      await this.mailService.sendPasswordResetEN(
        user.email,
        user.firstName,
        passwordResetLink,
      );
    } catch (err) {
      if (err instanceof UserNotFoundException) {
        this.logger.warn(err.message);
      } else {
        this.logger.error(err.message);
      }

      // throw err;
      throw new BadRequestException(
        this.i18n.t('_.error.message.resetPassword', {
          lang: options?.language,
        }),
      );
    }
  }

  async resetPasswordConfirm(
    password: string,
    token: string,
    options?: { language: string },
  ) {
    try {
      const { id, email }: IUserJwtPayload = this.jwtService.verify(token);

      let user = await this.usersService.findOneById(id, true);
      const passwordHash = await Hash(password);
      user = await this.usersService.update(id, { password: passwordHash });
      this.logger.verbose(
        `User ${userIdentity({ id, email })} updated its password`,
      );

      // * as this will go public, omit user from a response
      // return user;
    } catch (err) {
      // * record JWT errors in a case someone is doing forbidden actions
      if (err instanceof JsonWebTokenError) {
        this.logger.warn(`Password reset failed (${err.message}): ${token}`);
        // TODO remove throw from here as it's purpose is to demonstrate internationalization
        throw new UnauthorizedException(
          this.i18n.t('_.common.resetPassword.tokenExpired', {
            lang: options?.language,
          }),
        );
      } else if (err instanceof SyntaxError && err.message.includes('token')) {
        this.logger.warn(`Password reset failed (${err.message}): ${token}`);
      } else {
        this.logger.error(err.message);
      }

      throw new UnauthorizedException();
    }
  }

  async resendEmail(
    dto: ResendEmailConfirmationDto,
    options?: { language: string },
  ) {
    const user = await this.prismaService.user.findUnique({
      where: { email: dto.email },
    });

    if (user.emailResendTokens === 0) {
      // TODO return proper error code so FE can detect that problem is in email resend
      throw new BadRequestException();
    }

    if (
      user &&
      user.status === UserStatus.Unconfirmed &&
      [UserRole.Ambassador, UserRole.Client, UserRole.Influencer].includes(
        user.role,
      )
    ) {
      const { id, email, role, firstName } = user;
      await this.mailService.sendConfirmationEmail(
        id,
        email,
        role,
        firstName,
        options?.language,
      );
      await this.prismaService.user.update({
        data: { emailResendTokens: { decrement: 1 } },
        where: { id: user.id },
      });
    }
  }

  async confirmEmail(
    dto: EmailConfirmationDto,
    options?: { language: string },
  ) {
    try {
      const { id, email, role }: IUserJwtPayload =
        await this.jwtService.verifyAsync(dto.token);
      const user = await this.prismaService.user.findFirst({
        where: {
          id,
          email,
        },
        include: {
          ambassador: true,
          influencer: true,
        },
      });

      if (!user || user.role !== role) {
        throw new BadRequestException('Invalid email or user.');
      }

      if (user.status > UserStatus.Unconfirmed) {
        throw new BadRequestException(
          'E-mail already confirmed. Please login.',
        );
      }

      await this.prismaService.user.update({
        where: {
          id: user.id,
        },
        data: {
          status: UserStatus.Confirmed,
        },
      });

      const baseUrl = `${this._securityConfig.protocol}://${[
        this._securityConfig.appSubdomain,
        this._securityConfig.baseDomain,
      ]
        .filter((s) => !!s)
        .join('.')}`;

      const affiliateLink = generateAffiliateLink(baseUrl, user);

      await this.mailService.sendAccountActivated(
        email,
        role,
        user.firstName,
        affiliateLink,
        options?.language,
      );

      return { email, role };
    } catch (err) {
      if (err instanceof JsonWebTokenError) {
        throw new BadRequestException('Invalid token');
      }
      throw err;
    }
  }

  async getAffiliateLink(userId: number) {
    try {
      const user = await this.prismaService.user.findFirst({
        where: {
          id: userId,
        },
        include: {
          ambassador: true,
          influencer: true,
        },
      });

      const baseUrl = `${this._securityConfig.protocol}://${[
        this._securityConfig.appSubdomain,
        this._securityConfig.baseDomain,
      ]
        .filter((s) => !!s)
        .join('.')}`;

      const affiliateLink = generateAffiliateLink(baseUrl, user);

      return { affiliateLink };
    } catch (err) {
      throw err;
    }
  }

  async me(user: User) {
    return user;
  }
}
