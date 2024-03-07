import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../../core/users/users.module';
import { LocalStrategy } from './strategies/local.strategy';
import { PassportModule } from '@nestjs/passport';
import { AbilityFactory } from './ability/ability.factory';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MailModule } from 'src/integrations/mail/mail.module';

@Module({
  imports: [UsersModule, PassportModule, MailModule],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, AbilityFactory],
  exports: [AbilityFactory],
})
export class AuthModule {}
