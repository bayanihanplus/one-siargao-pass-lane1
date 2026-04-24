import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const OperatorCtx = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.operatorContext;
  },
);
