import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserEntity } from 'src/core/users/entities/user.entity';

export const AuthUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return new UserEntity(request.user);
  },
);
