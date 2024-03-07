import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { PrismaService } from './integrations/prisma/prisma.service';
import { WinstonModule } from 'nest-winston';
import { AppModule } from './app.module';
import { loggerOptions } from './config/logger.config';
import cookieParser from 'cookie-parser';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';
import { ApplicationExceptionFilter } from './exceptions/application-exception.filter';
import { SocketIoAdapter } from './integrations/socket.io/adapter/socket-io.adapter';

declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      ...loggerOptions,
    }),
  });

  /* app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      // transform: true,
    }),
  ); */
  // app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Patients Influence')
    .setDescription('Patients Influence platform API documentation.')
    .setVersion('1.0')
    .addTag('auth')
    .addTag('users')
    .addTag('client')
    .addTag('influencer')
    .addTag('ambassador')
    .addTag('company')
    .addTag('campaign')
    .addTag('surveys')
    .addTag('social media listening')
    .addTag('platform product order')
    .addTag('benefits')
    .addTag('labels')
    .addTag('location')
    .addTag('disease area')
    .addTag('file manager')
    .addTag('dropdown options')
    .addTag('enums and types')
    // TODO here add more tags
    .addCookieAuth('auth')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const configService = app.get(ConfigService);
  const apiPort = configService.get<number>('app.apiPort');

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);

  // * required for reading cookies from the Request object
  // else, they can be set up, but can't be read
  app.use(cookieParser());

  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  app.use(helmet());

  const baseUrl = `${configService.get('security.protocol')}://${[
    configService.get('security.appSubdomain'),
    configService.get('security.baseDomain'),
  ]
    .filter((s) => !!s)
    .join('.')}`;

  app.enableCors({
    origin: baseUrl,
    credentials: true,
    allowedHeaders:
      'Accept,Content-Type,Content-Length,Origin,X-Powered-By,X-Requested-With,Authorization',
  });

  app.useWebSocketAdapter(new SocketIoAdapter(app, configService));
  await app.listen(apiPort);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}
bootstrap();
