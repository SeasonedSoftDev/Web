import { I18nResolver, I18nResolverOptions } from 'nestjs-i18n';
import { ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class UserLanguageResolver implements I18nResolver {
  constructor(
    @I18nResolverOptions()
    private keys: string[] = ['lang'],
  ) {}

  async resolve(context: ExecutionContext) {
    let req: any;

    switch (context.getType() as string) {
      case 'http':
        req = context.switchToHttp().getRequest();
        break;
      case 'graphql':
        [, , { req }] = context.getArgs();
        break;
    }

    if (req?.user) {
      for (const key of this.keys) {
        if (req.user[key] !== undefined) {
          return req.user[key];
        }
      }
    }

    return undefined;
  }
}
