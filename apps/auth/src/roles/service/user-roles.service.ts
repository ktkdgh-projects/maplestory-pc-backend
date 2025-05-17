import { CreateUserRoleDto } from '@libs/common';
import { UserRoleLevel } from '@libs/database';
import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { ClientSession } from 'mongoose';
import { UserRolesRepository, UserRolesRepositoryToken } from '../repository/userRoles.repositoty';
import { RolesService, RolesServiceToken } from './roles.service';

export const UserRolesServiceToken = 'UserRolesServiceToken';

@Injectable()
export class UserRolesService {
    constructor(
        @Inject(UserRolesRepositoryToken)
        private readonly userRolesRepository: UserRolesRepository,
        @Inject(RolesServiceToken)
        private readonly rolesService: RolesService
    ) {}

    async assignUserRole(userId: string, session?: ClientSession): Promise<void> {
        const role = await this.rolesService.getRoleByName(UserRoleLevel.USER)
        
        const exists = await this.userRolesRepository.findUserRole(userId);
        if (exists) {
            throw new ConflictException('이미 해당 사용자에게 부여된 역할입니다.');
        }    

        const createUserRoleDto: CreateUserRoleDto = { userId, roleId: [role.id] };
        await this.userRolesRepository.createUserRole(createUserRoleDto, session);
    }
}
