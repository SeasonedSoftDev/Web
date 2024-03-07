import { INestApplicationContext, Logger, Inject } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { createAuthMiddleware } from '../middleware';
import securityConfig from 'src/config/security.config';
import appConfig from 'src/config/app.config';

export class SocketIoAdapter extends IoAdapter {
  private readonly logger = new Logger(SocketIoAdapter.name);
  constructor(
    private appContext: INestApplicationContext,
    private configService: ConfigService,
  ) {
    super(appContext);
  }

  createIOServer(port: number, options?: ServerOptions) {
    const jwtService = this.appContext.get(JwtService);
    const cookieName = this.configService.get('security.jwt.cookieName');

    port = this.configService.get('app.apiSocketPort');
    // const path = this.configService.get<string>('app.socketPath');
    const baseUrl = `${this.configService.get('security.protocol')}://${[
      this.configService.get('security.appSubdomain'),
      this.configService.get('security.baseDomain'),
    ]
      .filter((s) => !!s)
      .join('.')}`;
    // options.path = path;
    options.cors = { origin: baseUrl };
    const server: Server = super.createIOServer(port, options);

    ['chat', 'notifications'].forEach((namespace) => {
      server
        .of(namespace)
        .use(createAuthMiddleware(jwtService, cookieName, this.logger));
    });

    this.logger.verbose(
      `Server initialized on port:${port}. With origins: ${options.cors.origin}`,
    );

    return server;
  }
}
