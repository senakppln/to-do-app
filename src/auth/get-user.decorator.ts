import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { user } from '@prisma/client';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): user => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
