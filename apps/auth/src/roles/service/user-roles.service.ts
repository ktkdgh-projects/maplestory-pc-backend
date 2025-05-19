import { CreateUserRoleDto, IRoleUserSummary, IRoleUserList } from '@libs/common';
import { IUserRole, mapUserDoc, UserRoleLevel } from '@libs/database';
import { BadRequestException, ConflictException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { ClientSession, isValidObjectId } from 'mongoose';
import { RolesRepository, RolesRepositoryToken } from '../repository/roles.repository';
import { UserRolesRepository, UserRolesRepositoryToken } from '../repository/user-roles.repositoty';
import { RolesService, RolesServiceToken } from './roles.service';

export const UserRolesServiceToken = 'UserRolesServiceToken';

@Injectable()
export class UserRolesService {
    constructor(
        @Inject(UserRolesRepositoryToken)
        private readonly userRolesRepository: UserRolesRepository,
        @Inject(RolesRepositoryToken)
        private readonly rolesRepository: RolesRepository,
        @Inject(RolesServiceToken)
        private readonly rolesService: RolesService,
    ) {}

    async assignUserRole(userId: string, session?: ClientSession): Promise<void> {
        const role = await this.rolesService.getRoleByName(UserRoleLevel.USER);

        const exists = await this.userRolesRepository.findUserRoleByUserId(userId);
        if (exists) {
            throw new ConflictException('해당 권한이 이미 부여되어 있습니다.');
        }

        const createUserRoleDto: CreateUserRoleDto = { userId, roleId: role.id };
        await this.userRolesRepository.createUserRole(createUserRoleDto, session);
    }

    async getUserRoleByUserId(userId: string): Promise<IUserRole> {
        const userRole = await this.userRolesRepository.findUserRoleByUserId(userId);
        if (!userRole) {
            throw new NotFoundException(`해당 유저의 권한이 존재하지 않습니다.`);
        }

        return userRole;
    }

    async getUsersByRole(
        userId: string,
        role: UserRoleLevel | 'ALL',
        pageParam: number,
        limitSize: number,
    ): Promise<IRoleUserList> {
        if (!isValidObjectId(userId)) {
            throw new BadRequestException('유효하지 않은 userId 형식입니다.');
        }
        let roleId: string | null = null;

        if (role !== 'ALL') {
            const roleInfo = await this.rolesRepository.findByName(role);
            if (!roleInfo) {
                throw new NotFoundException(`"${role}" 역할을 찾지 못했습니다.`);
            }
            roleId = roleInfo.id;
        }

        const users = await this.userRolesRepository.findUserRoleByRoleId(roleId, pageParam, limitSize);

        const items: IRoleUserSummary[] = users.map((userRole) => {
            const user = mapUserDoc(Object(userRole.userId));

            return {
                userId: user._id.toString(),
                email: user.email,
                nickname: user.nickname,
                name: Object(userRole.roleId).name,
                isMe: userId ? user._id.toString() === userId : false,
            };
        });

        const isLastPage = users.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }
}
