import { IJwtPayloadData } from '@libs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const AuthUser = createParamDecorator((data: keyof IJwtPayloadData, context: ExecutionContext) => {
    const user = context.switchToHttp().getRequest<Request>().user as IJwtPayloadData;

    return data ? user && user[data] : user;
});
