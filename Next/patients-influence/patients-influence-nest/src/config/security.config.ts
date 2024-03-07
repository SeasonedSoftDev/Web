import { registerAs } from '@nestjs/config';
import { SecurityEnvironmentVariables } from './dto/security-config.dto';
import { validate } from './utils/env-validation';
import { ISecurityConfig } from './interfaces/security-config.interface';

export default registerAs('security', (): ISecurityConfig => {
  validate(process.env, SecurityEnvironmentVariables);

  return {
    secretKey: process.env.SECRET_KEY,
    baseDomain: process.env.BASE_DOMAIN,
    appSubdomain: process.env.APP_SUBDOMAIN,
    mlBaseDomain: process.env.ML_BASE_DOMAIN,
    protocol: process.env.PROTOCOL || 'http',
    password: {
      bcryptSaltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS) || 12,
    },
    jwt: {
      cookieName: process.env.JWT_COOKIE_NAME || 'auth',
      expiresIn: process.env.JWT_EXPIRES_IN || '1d',
    },
    rateLimit: {
      ttl: process.env.RATE_LIMIT_TTL
        ? parseInt(process.env.RATE_LIMIT_TTL)
        : 60,
      limit: process.env.RATE_LIMIT_LIMIT
        ? parseInt(process.env.RATE_LIMIT_LIMIT)
        : 10,
    },
  };
});
