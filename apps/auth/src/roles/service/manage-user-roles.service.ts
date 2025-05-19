import { ManageUserRolesDto, Transactional, CreateUserRoleLogDto } from '@libs/common';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { RolesRepository, RolesRepositoryToken } from '../repository/roles.repository';
import { UserRoleLogsRepository, UserRoleLogsRepositoryToken } from '../repository/user-role-logs.repository';
import { UserRolesRepository, UserRolesRepositoryToken } from '../repository/user-roles.repositoty';

export const ManageUserRolesServiceToken = 'ManageUserRolesServiceToken';

@Injectable()
export class ManageUserRolesService {
    constructor(
        @InjectConnection()
        private readonly connection: Connection,

        @Inject(UserRolesRepositoryToken)
        private readonly userRolesRepository: UserRolesRepository,
        @Inject(RolesRepositoryToken)
        private readonly rolesRepository: RolesRepository,
        @Inject(UserRoleLogsRepositoryToken)
        private readonly userRoleLogsRepository: UserRoleLogsRepository,
    ) {}

    @Transactional()
    async manageUserRole(dto: ManageUserRolesDto, session?: ClientSession): Promise<{ message: string }> {
        const { userId, newRoleName, changedBy, reason } = dto;

        const userRole = await this.userRolesRepository.findUserRoleByUserId(userId);
        if (!userRole) {
            throw new NotFoundException('사용자 권한 정보를 찾을 수 없습니다.');
        }

        const prevRoleName = Object(userRole.roleId).name;
        if (prevRoleName === newRoleName) {
            throw new BadRequestException('변경할 역할과 현재 역할이 동일합니다.');
        }

        const newRole = await this.rolesRepository.findByName(newRoleName);
        if (!newRole) {
            throw new NotFoundException(`"${newRoleName}" 역할을 찾지못했습니다.`);
        }

        const result = await this.userRolesRepository.updatedUserRole(userId, newRole.id, session);
        if (result === 0) {
            throw new InternalServerErrorException('사용자 역할 변경에 실패했습니다');
        }

        const logDto: CreateUserRoleLogDto = { userId, prevRoleName, newRoleName, changedBy, reason };
        await this.userRoleLogsRepository.createUserRoleLog(logDto, session);

        return { message: '역할이 성공적으로 변경되었습니다' };
    }
}
