// source REF: https://docs.nestjs.com/techniques/configuration
// modified by REF: https://dev.to/rrgt19/ways-to-validate-environment-configuration-in-a-forfeature-config-in-nestjs-2ehp

import { ClassConstructor, plainToClass } from 'class-transformer';
import { validateSync } from 'class-validator';

export function validate(
  config: Record<string, unknown>,
  envVariablesClass: ClassConstructor<any>,
) {
  const validatedConfig = plainToClass(envVariablesClass, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
