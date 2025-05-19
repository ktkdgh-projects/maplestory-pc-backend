import { IAccessToken } from '@libs/common';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserProfileService, UserProfileServiceToken } from '../../users/service/user-profile.service';
import { Pbkdf2Service, Pbkdf2ServiceToken } from './pbkdf2.service';
import { TokenService, TokenServiceToken } from './token.service';

export const RefreshServiceToken = 'RefreshServiceToken';

@Injectable()
export class RefreshService {
    constructor(
        @Inject(TokenServiceToken)
        private readonly tokenService: TokenService,
        @Inject(UserProfileServiceToken)
        private readonly userProfileService: UserProfileService,
        @Inject(Pbkdf2ServiceToken)
        private readonly pbkdf2Service: Pbkdf2Service,
    ) {}

    async handleRefresh(token: string): Promise<IAccessToken> {
        const { payload } = this.tokenService.verifyRefreshToken(token);
        const user = await this.userProfileService.getUserByEmail(payload.email);

        const isRefreshValid = this.pbkdf2Service.comparePBKDF2(token, user.refreshTokenSalt, user.refreshToken);
        if (!isRefreshValid) {
            throw new UnauthorizedException('토큰이 일치하지 않습니다.');
        }

        const accessToken = await this.tokenService.issueAccessToken(payload);

        return { accessToken };
    }
}
