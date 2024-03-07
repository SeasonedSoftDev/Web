import { Inject, Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../users/entities/user.entity';
import { AmbassadorTokenPayload } from './types/ambassador-token-payload.type';
import { ConfigType } from '@nestjs/config';
import { PrismaService } from 'src/integrations/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import { convertToMilliseconds } from 'src/utils';
import securityConfig from 'src/config/security.config';

@Injectable()
export class AdminService {
  private readonly logger = new Logger(AdminService.name);

  constructor(
    private readonly jwtService: JwtService,
    @Inject(securityConfig.KEY)
    private readonly _securityConfig: ConfigType<typeof securityConfig>,
    private readonly prismaService: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) { }

  static queryInclude: Prisma.UserInclude = {
    admin: { include: { adminPermissions: true, adminRoles: true } },
  };

  async generateAmbassadorInvLink(user: UserEntity) {
    const logX = await this.prismaService.user.findFirstOrThrow({
      where: { id: user.id },
      include: AdminService.queryInclude,
    });

    console.log('xxxx', logX);

    try {
      const payload: AmbassadorTokenPayload = {
        invitedByAdmin: (
          await this.prismaService.user.findFirstOrThrow({
            where: { id: user.id },
            include: AdminService.queryInclude,
          })
        ).admin.id,
      };
      const token = this.jwtService.sign(payload);

      await this.cacheManager.set(
        JSON.stringify(token),
        token,
        convertToMilliseconds('1d'),
      );
      const baseUrl = `${this._securityConfig.protocol}://${[
        this._securityConfig.appSubdomain,
        this._securityConfig.baseDomain,
      ]
        .filter((s) => !!s)
        .join('.')}`;
      return `${baseUrl}/register?as=ambassador&token=${token}`;
    } catch (error) {
      this.logger.warn(error);
      throw error;
    }
  }
}
