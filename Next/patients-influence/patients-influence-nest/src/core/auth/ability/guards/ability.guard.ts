import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ForbiddenError } from '@casl/ability';
import { UnauthorizedException } from '@nestjs/common/exceptions';
import { AbilityFactory } from '../ability.factory';
import { RequiredRule, CHECK_ABILITY } from '../decorators/ability.decorator';

@Injectable()
export class AbilitiesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private caslAbilityFactory: AbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // pull back the rules provided by CheckAbilities decorator
    const rules =
      this.reflector.get<RequiredRule[]>(CHECK_ABILITY, context.getHandler()) ||
      [];

    // if there are no rules, pass through
    if (rules.length === 0) return true;

    // get authenticated user so his abilities are checked
    const { user } = context.switchToHttp().getRequest();

    // if user is not authenticated, return unauthorized
    // ! (JwtAuthGuard makes sure for it, but catch it for any case)
    if (!user) {
      throw new UnauthorizedException();
    }

    const ability = this.caslAbilityFactory.defineAbility(user);

    try {
      rules.forEach((rule) => {
        // throw an error if any rule is broken
        ForbiddenError.from(ability).throwUnlessCan(rule.action, rule.subject);
      });

      return true;
    } catch (err) {
      // if user doesn't have permission, return forbidden
      if (err instanceof ForbiddenError) {
        throw new ForbiddenException(err.message);
      }
    }
  }
}
