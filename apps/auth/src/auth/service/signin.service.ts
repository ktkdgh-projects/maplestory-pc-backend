import { SigninDto, IJwtTokens, IJwtPayloadData } from '@libs/common'
import { IUser } from '@libs/database';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserRolesService, UserRolesServiceToken } from '../../roles/service/user-roles.service';
import { UserProfileService, UserProfileServiceToken } from '../../users/service/user-profile.service';
import { Pbkdf2Service, Pbkdf2ServiceToken } from './pbkdf2.service';
import { TokenService, TokenServiceToken } from './token.service';

export const SigninServiceToken = 'SigninServiceToken';

@Injectable()
export class SigninService {
    constructor(
        @Inject(UserProfileServiceToken)
        private readonly userProfileService: UserProfileService,
        @Inject(UserRolesServiceToken)
        private readonly userRolesService: UserRolesService,
        @Inject(TokenServiceToken)
        private readonly tokenService: TokenService,
        @Inject(Pbkdf2ServiceToken)
        private readonly pbkdf2Service: Pbkdf2Service
    ) {}

    async signin(signinDto: SigninDto): Promise<IJwtTokens> {
        const { email, password } = signinDto;

        const userInfo = await this.verifyUserByEmail(email, password);
        const payload = await this.buildJwtPayload(userInfo);
        
        const [accessToken, refreshToken] = await Promise.all([
            this.tokenService.issueAccessToken(payload),
            this.tokenService.issueRefreshToken(payload),
        ]);

        const { salt, encryptedData } = this.pbkdf2Service.encryptPBKDF2(refreshToken)
        await this.userProfileService.updateRefreshToken(userInfo.id, encryptedData, salt)

        return { accessToken, refreshToken };
    }

    private async verifyUserByEmail(email: string, password: string,): Promise<IUser> {
        const user = await this.userProfileService.getUserByEmail(email);

        const isPasswordValid = this.pbkdf2Service.comparePBKDF2(password, user.passwordSalt, user.password)
        if (!isPasswordValid) {
            throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
        }
        return user;
    }

    private async buildJwtPayload(user: IUser): Promise<IJwtPayloadData> {
        const userRoleData = await this.userRolesService.getUserRoleByUserId(user.id);

        const roles = userRoleData.roleId
            .map(roleStr => roleStr.match(/name:\s*'([^']+)'/)?.[1])
            .filter((roleName): roleName is string => Boolean(roleName));

        const payload: IJwtPayloadData = {
            sub: { id: user.id },
            email: user.email,
            role: roles,
        };

        return payload;
    }
}
