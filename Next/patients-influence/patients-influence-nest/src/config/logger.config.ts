import {
  WinstonModuleOptions,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import * as winston from 'winston';
import { Environment } from './dto/app-config.dto';

export const loggerOptions: WinstonModuleOptions = {
  level:
    process.env.NODE_ENV === undefined ||
    process.env.NODE_ENV === Environment.Development
      ? 'debug'
      : 'info',
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.ms(),
        nestWinstonModuleUtilities.format.nestLike('Patients Influence', {
          colors: true,
          prettyPrint: true,
        }),
      ),
    }),
  ],
};
