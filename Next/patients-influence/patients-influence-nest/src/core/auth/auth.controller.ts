import {
  Controller,
  Post,
  UseGuards,
  Req,
  Res,
  Inject,
  HttpStatus,
  HttpCode,
  Body,
  Get,
  ParseIntPipe,
  Param,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDto,
  ResendEmailConfirmationDto,
  EmailConfirmationDto,
} from './dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Request, Response } from 'express';
import { User } from '@prisma/client';
import {
  ApiBody,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import securityConfig from '../../config/security.config';
import { ConfigType } from '@nestjs/config';
import { convertToMilliseconds } from '../../utils';
import { Public } from './decorators/public.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { classToPlain, instanceToPlain } from 'class-transformer';
import { NoAutoSerialize } from '../../decorators/no-auto-serialize.decorator';
import { serializeObject } from '../../utils/serializers/object.serializer';
import {
  ResetPasswordConfirmDto,
  ResetPasswordDto,
} from './dto/reset-password.dto';
// import { Throttle } from '@nestjs/throttler';
import appConfig from '../../config/app.config';
import { Environment } from '../../config/dto/app-config.dto';
import { I18n, I18nContext } from 'nestjs-i18n';
import { getUserByIdDto } from './dto/get-user.dto';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    @Inject(securityConfig.KEY)
    private readonly _securityConfig: ConfigType<typeof securityConfig>,
    @Inject(appConfig.KEY)
    private readonly _appConfig: ConfigType<typeof appConfig>,
  ) {}

  // * throttle more than other endpoints
  // @Throttle(3, 60)
  @Post('login')
  @ApiOperation({
    summary: 'Login to the platform',
    description:
      'Initiate the user session by providing valid credentials and retrieving the auth cookie.' +
      '<br><br>For each invalid login attempt, a user retrieves a generic response for security reasons, eg. unauthorized.' +
      "<br>If credentials are valid but the user is not verified, he gets a message that he's forbidden to get in. A verification token is sent to the email upon registration.",
  })
  @ApiBody({
    type: LoginDto,
  })
  @ApiOkResponse({
    description: 'User logged in.',
    type: UserEntity,
  })
  @ApiUnauthorizedResponse({
    description: 'Credentials invalid.',
  })
  @ApiForbiddenResponse({
    description: 'User not yet verified.',
  })
  @Public()
  @NoAutoSerialize()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Req() req: Request, @Res() res: Response) {
    const accessToken = (await this.authService.login(req.user as User))
      .accessToken;

    return (
      res
        .cookie(this._securityConfig.jwt.cookieName, accessToken, {
          httpOnly: false,
          maxAge: convertToMilliseconds(this._securityConfig.jwt.expiresIn),
          sameSite:
            this._appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
          secure: this._appConfig.nodeEnv === Environment.Production,
          domain: this._securityConfig.baseDomain,
        })
        // * manually serialize
        .json(serializeObject(req.user, UserEntity))
      // .json(instanceToPlain(new UserEntity(req.user)))
    );
  }

  @Post('logout')
  @ApiOperation({
    summary: 'Logout from the platform',
    description:
      'Terminate the user session by killing the auth cookie.' +
      "<br><br>For valid logout, the auth cookie must be present, or else it means that the user wasn't logged in before.",
  })
  @ApiOkResponse({
    description: 'User logged out.',
  })
  @ApiUnauthorizedResponse({
    description: "Can't terminate non-existing session.",
  })
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async logout(@Req() req: Request, @Res() res: Response) {
    // remove cookie content and set its maxAge to 0 so browser removes it automatically
    // also, send the usual response format
    return res
      .cookie(this._securityConfig.jwt.cookieName, '', {
        httpOnly: false,
        maxAge: 0,
        sameSite:
          this._appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
        secure: this._appConfig.nodeEnv === Environment.Production,
        domain: this._securityConfig.baseDomain,
      })
      .send();
  }

  @Post('resetPassword')
  @Public()
  @ApiOkResponse({
    description: 'An email has been sent with a link for password reset',
  })
  @ApiNotFoundResponse({
    description: 'Provided email does not correspond to any user',
  })
  @HttpCode(HttpStatus.OK)
  resetPassword(
    @Body() resetPasswordDto: ResetPasswordDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.resetPassword(resetPasswordDto.email, {
      language: i18n.lang,
    });
  }

  @Post('resetPassword/confirm')
  @Public()
  @NoAutoSerialize()
  @HttpCode(HttpStatus.OK)
  async resetPasswordConfirm(
    @Req() req: Request,
    @Res() res: Response,
    @Body() resetPasswordConfirmDto: ResetPasswordConfirmDto,
    @I18n() i18n: I18nContext,
  ) {
    await this.authService.resetPasswordConfirm(
      resetPasswordConfirmDto.password,
      resetPasswordConfirmDto.token,
      { language: i18n.lang },
    );

    // * logout after saving a new password
    return res
      .cookie(this._securityConfig.jwt.cookieName, '', {
        httpOnly: false,
        maxAge: 0,
        sameSite:
          this._appConfig.nodeEnv === Environment.Production ? 'none' : 'lax',
        secure: true,
        domain: this._securityConfig.baseDomain,
      })
      .send();
  }

  @Post('resendEmailConfirmation')
  @Public()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Resend Confirmation Email',
    description: 'Sends an email with confirmation url',
  })
  async resendConfirmationEmail(
    @Body() dto: ResendEmailConfirmationDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.resendEmail(dto, { language: i18n.lang });
  }

  @Post('emailConfirmation')
  @Public()
  @ApiOperation({
    summary: 'Confirm email',
    description: 'Confirm email via verification link received in email.',
  })
  @HttpCode(HttpStatus.OK)
  async confirmEmail(
    @Body() dto: EmailConfirmationDto,
    @I18n() i18n: I18nContext,
  ) {
    return this.authService.confirmEmail(dto, { language: i18n.lang });
  }

  @Get('me')
  @ApiOperation({
    summary: "Get logged-in user's data",
    description:
      "Retrieves logged-in user's basic data, such as first name, last name, an email and the role. Some other data are included also, but not as much as one could get at other endpoints.",
  })
  async me(@Req() req: Request) {
    return new UserEntity(await this.authService.me(req.user as User));
  }

  @Get('affiliateLink/:userId')
  @ApiOperation({
    summary: 'Get users affiliate link',
    description:
      'Get users affiliate link that can be used to provide to wanted entities registration link based on the users role',
  })
  @HttpCode(HttpStatus.OK)
  async getAffiliateLink(@Param('userId', ParseIntPipe) userId: number) {
    return this.authService.getAffiliateLink(userId);
  }
}
