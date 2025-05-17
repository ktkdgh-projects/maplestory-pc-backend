import { IUserSummary } from '@libs/common';
import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { UsersRepositoryToken, UsersRepository } from '../repository/users.repository';

export const UserProfileServiceToken = 'UserProfileServiceToken';

@Injectable()
export class UserProfileService {
    constructor(
        @Inject(UsersRepositoryToken)
        private readonly usersRepository: UsersRepository,
    ) {}

    async getUserByEmail(email: string): Promise<IUserSummary> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException(`"${email}"에 해당하는 사용자를 찾을 수 없습니다.`);
        }

        return {
            id: user._id.toString(),
            email: user.email,
            nickname: user.nickname,
        };
    }
}
