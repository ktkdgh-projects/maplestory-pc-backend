import { CreateUserRoleDto } from '@libs/common';
import { UserRoleLevel, IUserRole } from '@libs/database';
import { Injectable, Inject, ConflictException, NotFoundException } from '@nestjs/common';
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
        
        const exists = await this.userRolesRepository.findUserRoleByUserId(userId);
        if (exists) {
            throw new ConflictException('해당 권한이 이미 부여되어 있습니다.');
        }    

        const createUserRoleDto: CreateUserRoleDto = { userId, roleId: [role.id] };
        await this.userRolesRepository.createUserRole(createUserRoleDto, session);
    }

    async getUserRoleByUserId(userId: string): Promise<IUserRole> {
        const userRole = await this.userRolesRepository.findUserRoleByUserId(userId);
        if (!userRole) {
            throw new NotFoundException(`해당 유저의 권한이 존재하지 않습니다.`)
        }

        return userRole
    }
}
