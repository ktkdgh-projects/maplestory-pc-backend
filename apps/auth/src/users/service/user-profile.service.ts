import { IUserSummary } from '@libs/common';
import { IUser } from '@libs/database';
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { UsersRepository, UsersRepositoryToken } from '../repository/users.repository';

export const UserProfileServiceToken = 'UserProfileServiceToken';

@Injectable()
export class UserProfileService {
    constructor(
        @Inject(UsersRepositoryToken)
        private readonly usersRepository: UsersRepository,
    ) {}

    async getUserSummaryByEmail(email: string): Promise<IUserSummary> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new NotFoundException(`"${email}"에 해당하는 사용자를 찾을 수 없습니다.`);
        }

        return {
            id: user._id.toString(),
            email: user.email,
            nickname: user.nickname,
            inviteCode: user.inviteCode,
        };
    }

    async getUserByEmail(email: string): Promise<IUser> {
        const user = await this.usersRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundException(`"${email}"에 해당하는 사용자를 찾을 수 없습니다.`);
        }

        return user;
    }

    async updateRefreshToken(userId: string, refreshToken: string, refreshTokenSalt: string): Promise<void> {
        const result = await this.usersRepository.updateRefreshToken(userId, refreshToken, refreshTokenSalt);

        if (result === 0) {
            throw new InternalServerErrorException('refreshToken 수정에 실패했습니다');
        }
    }
}
