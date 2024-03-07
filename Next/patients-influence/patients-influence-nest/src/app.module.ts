import { Logger, Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './integrations/prisma/prisma.module';
import { MailModule } from './integrations/mail/mail.module';
import { AuthModule } from './core/auth/auth.module';
import { ClientModule } from './core/client/client.module';
import { UsersModule } from './core/users/users.module';
import { AppService } from './app.service';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { SendgridExceptionFilter } from './integrations/mail/exceptions/sendgrid-exception.filter';
import appConfig from './config/app.config';
import securityConfig from './config/security.config';
import sendgridConfig from './config/sendgrid.config';
import { AbilitiesGuard } from './core/auth/ability/guards/ability.guard';
import { JwtAuthGuard } from './core/auth/guards/jwt-auth.guard';
import { AppController } from './app.controller';
import { JwtModule } from '@nestjs/jwt';
import { InfluencerModule } from './core/influencer/influencer.module';
import { PrismaClientExceptionFilter } from './exceptions/prisma-client-exception.filter';
import { ResponseSerializerInterceptor } from './interceptors/response-serializer.interceptor';
import { AmbassadorModule } from './core/ambassador/ambassador.module';
import { CompanyModule } from './core/common/company/company.module';
import { LocationModule } from './core/common/location/location.module';
import { DiseaseAreaModule } from './core/common/disease-area/disease-area.module';
import {
  AcceptLanguageResolver,
  CookieResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { UserLanguageResolver } from './utils/i18n/resolvers/user-language-resolver.resolver';
import { Environment } from './config/dto/app-config.dto';
// import { ThrottlerModule } from '@nestjs/throttler';
import { ThrottlerBehindProxyGuard } from './guards/throttler-behind-proxy.guard';
import { ThrottlerExceptionFilter } from './exceptions/throttler-exception.filter';
import { CampaignModule } from './core/campaign/campaign.module';
import { BenefitModule } from './core/benefit/benefit.module';
import { PlatformProductModule } from './core/platform-product/platform-product.module';
import { ChatModule } from './core/chat/chat.module';
import { FinanceModule } from './core/finance/finance.module';
import { SocialModule } from './integrations/social/social.module';
import { StakeholdersModule } from './core/stakeholders/stakeholders.module';
import socialConfig from './config/social.config';
import { AxiosExceptionFilter } from './exceptions/axios-exception.filter';
import { LabelsModule } from './core/common/labels/labels.module';
import { ApplicationExceptionFilter } from './exceptions/application-exception.filter';
import { AwsS3Module } from './integrations/aws-s3/aws-s3.module';
import { FileManagerModule } from './core/file-manager/file-manager.module';
import awsConfig from './config/aws.config';
import { CalendarModule } from './core/calendar/calendar.module';
import { NotificationsModule } from './core/notifications/notifications.module';
import { SMLModule } from './core/sml/sml.module';
import { SurveysModule } from './core/surveys/surveys.module';
import { AdminModule } from './core/admin/admin.module';
import { InsightModule } from './core/insight/insight.module';
import { ScheduleModule } from '@nestjs/schedule';
import { CacheModule } from '@nestjs/cache-manager';
import { LegalsModule } from './core/common/legals/legals.module';
import { IndustryModule } from './core/common/industry/industry.module';
import { ProductsModule } from './core/common/products/products.module';
import { InfluencerSizesModule } from './core/common/influencer-sizes/influencer-sizes.module';
import { EthnicityModule } from './core/common/ethnicity/ethnicity.module';
import { StrugglesModule } from './core/common/struggles/struggles.module';
import { InterestsModule } from './core/common/interests/interests.module';
import { SymptomsModule } from './core/common/symptoms/symptoms.module';
import { CacheAndInvalidateInterceptor } from './interceptors/cache-and-invalidate.interceptor';
import { CacheInvalidateInterceptor } from './interceptors/cache-invalidate.interceptor';
import { CurrencyModule } from './core/common/currency/currency.module';

@Module({
  imports: [
    CacheModule.register({ isGlobal: true }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [
        appConfig,
        securityConfig,
        sendgridConfig,
        socialConfig,
        awsConfig,
      ],
    }),
    JwtModule.registerAsync({
      global: true,
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => {
        const secretKey = configService.get<string>('security.secretKey');
        const expiresIn = configService.get<string>('security.jwt.expiresIn');

        return {
          secret: secretKey,
          signOptions: { expiresIn },
        };
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: 'en',
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: process.env.NODE_ENV === Environment.Development ? true : false,
      },
      resolvers: [
        // reference: https://nestjs-i18n.com/concepts/resolver
        new UserLanguageResolver(['lang', 'language', 'preferredLanguage']), // reads authenticated user's property
        new QueryResolver(['lang', 'l']), // reads "lang" or "l" from query parameters
        // AcceptLanguageResolver, // reads "accept-language" header
        // new CookieResolver(), // reads "lang" cookie
        // new HeaderResolver(['x-pi-lang']), // reads "x-pi-lang" custom header
      ],
    }),
    // ThrottlerModule.forRootAsync({
    //   inject: [ConfigService],
    //   useFactory: async (configService: ConfigService) => {
    //     const ttl = configService.get<number>('security.rateLimit.ttl');
    //     const limit = configService.get<number>('security.rateLimit.limit');

    //     return {
    //       ttl,
    //       limit,
    //       // don't throttle requests that have 'googlebot' or 'bingbot' defined in them
    //       ignoreUserAgents: [/googlebot/gi, /bingbot/gi],
    //     };
    //   },
    // }),
    ScheduleModule.forRoot(),
    PrismaModule,
    MailModule,
    AuthModule,
    ClientModule,
    UsersModule,
    InfluencerModule,
    AmbassadorModule,
    CompanyModule,
    LocationModule,
    CampaignModule,
    DiseaseAreaModule,
    BenefitModule,
    PlatformProductModule,
    ChatModule,
    FinanceModule,
    SocialModule,
    StakeholdersModule,
    LabelsModule,
    AwsS3Module,
    FileManagerModule,
    CalendarModule,
    NotificationsModule,
    SMLModule,
    SurveysModule,
    AdminModule,
    InsightModule,
    LegalsModule,
    IndustryModule,
    ProductsModule,
    InfluencerSizesModule,
    EthnicityModule,
    StrugglesModule,
    InterestsModule,
    SymptomsModule,
    CurrencyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Logger,
    // { provide: APP_FILTER, useClass: ThrottlerExceptionFilter },
    { provide: APP_FILTER, useClass: PrismaClientExceptionFilter },
    { provide: APP_FILTER, useClass: SendgridExceptionFilter },
    { provide: APP_FILTER, useClass: AxiosExceptionFilter },
    { provide: APP_FILTER, useClass: ApplicationExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    { provide: APP_GUARD, useClass: AbilitiesGuard },
    // { provide: APP_GUARD, useClass: ThrottlerBehindProxyGuard },
    { provide: APP_INTERCEPTOR, useClass: ResponseSerializerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CacheAndInvalidateInterceptor },
    { provide: APP_INTERCEPTOR, useClass: CacheInvalidateInterceptor },
  ],
})
export class AppModule {}
