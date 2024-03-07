import { SetMetadata } from '@nestjs/common';
import { Action } from '../enums/action.enum';
import { AppSubjects } from '../types/app-subjects.type';

export interface RequiredRule {
  action: Action;
  subject: AppSubjects;
}

export const CHECK_ABILITY = 'check_ability';

export const CheckAbilities = (...requirements: RequiredRule[]) =>
  SetMetadata(CHECK_ABILITY, requirements);
