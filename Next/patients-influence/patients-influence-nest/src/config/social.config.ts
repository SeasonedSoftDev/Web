import { registerAs } from '@nestjs/config';
import { validate } from '../config/utils/env-validation';
import { ISocialConfig } from './interfaces/social-config.interface';
import { InstagramEnvironmentVariables } from './dto/social-config.dto';

export default registerAs('social', (): ISocialConfig => {
  validate(process.env, InstagramEnvironmentVariables);

  return {
    instagram: {
      clientId: process.env.INSTAGRAM_CLIENT_ID,
      clientSecret: process.env.INSTAGRAM_CLIENT_SECRET,
      redirectURI: process.env.INSTAGRAM_REDIRECT_URI,
    },
  };
});
