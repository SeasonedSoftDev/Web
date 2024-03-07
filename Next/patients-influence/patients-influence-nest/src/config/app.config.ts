import { registerAs } from '@nestjs/config';
import { AppEnvironmentVariables, Environment } from './dto/app-config.dto';
import { IAppConfig } from './interfaces/app-config.interface';
import { validate } from './utils/env-validation';

export default registerAs('app', (): IAppConfig => {
  validate(process.env, AppEnvironmentVariables);

  return {
    nodeEnv: process.env.NODE_ENV || Environment.Development,
    apiPort: parseInt(process.env.API_PORT) || 3000,
    apiSocketPort: parseInt(process.env.API_SOCKET_PORT) || 3001,
  };
});
