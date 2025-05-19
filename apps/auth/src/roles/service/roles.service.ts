import { UserRoleLevel, Role, IRole } from '@libs/database';
import { Injectable, Inject, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { RolesRepository, RolesRepositoryToken } from '../repository/roles.repository';

export const RolesServiceToken = 'RolesServiceToken';

@Injectable()
export class RolesService {
    constructor(
        @Inject(RolesRepositoryToken)
        private readonly rolesRepository: RolesRepository,
    ) {}

    async initRoles(): Promise<{ message: string }> {
        const existing = await this.rolesRepository.count();
        if (existing > 0) {
            throw new ConflictException('역할이 이미 초기화되어 있습니다.');
        }

        const roles: Array<Pick<Role, 'name' | 'description'>> = [
            { name: UserRoleLevel.USER, description: '기본 사용자' },
            { name: UserRoleLevel.OPERATOR, description: '운영자' },
            { name: UserRoleLevel.AUDITOR, description: '감시자' },
            { name: UserRoleLevel.ADMIN, description: '관리자' },
        ];

        try {
            await this.rolesRepository.insertMany(roles);
        } catch (error) {
            throw new InternalServerErrorException('역할 초기화 중 오류가 발생했습니다.');
        }

        return { message: '역할이 성공적으로 초기화되었습니다.' };
    }

    async getRoleByName(name: UserRoleLevel): Promise<IRole> {
        const role = await this.rolesRepository.findByName(name);
        if (!role) {
            throw new NotFoundException(`"${name}"에 해당하는 역할이 존재하지 않습니다.`);
        }

        return role;
    }
}
