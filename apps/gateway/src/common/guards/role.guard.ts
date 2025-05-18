import {
    CanActivate,
    ExecutionContext,
    Injectable,
    ForbiddenException,
    UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Permissions, PermissionKey } from './permissions';

@Injectable()
export class RoleGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const permission = this.reflector.get<PermissionKey>('permission', context.getHandler());

        if (!permission) {
            return true; 
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;
        if (!user?.role) {
            throw new UnauthorizedException('사용자 정보가 없거나 인증되지 않았습니다.');
        }

        const allowedRoles = Permissions[permission];
        if (!allowedRoles) {
            throw new ForbiddenException('허용된 권한이 정의되어 있지 않습니다.');
        }
        
        if (!allowedRoles.includes(user.role)) {
            throw new ForbiddenException(`요청한 작업을 수행할 수 있는 권한이 없습니다.`);
        }

        return true;
    }
}
