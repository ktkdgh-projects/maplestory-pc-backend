import { SigninDto, IJwtTokens, IAccessToken } from '@libs/common';
import { Controller, Inject, Post, Body } from '@nestjs/common';
import { RefreshService, RefreshServiceToken } from './service/refresh.service';
import { SigninService, SigninServiceToken } from './service/signin.service';
import { SignoutService, SignoutServiceToken } from './service/signout.service';
@Controller('auth')
export class AuthController {
    constructor(
        @Inject(SigninServiceToken)
        private readonly signinService: SigninService,
        @Inject(SignoutServiceToken)
        private readonly signoutService: SignoutService,
        @Inject(RefreshServiceToken)
        private readonly refreshService: RefreshService
    ) {}

    @Post('signin')
    async signIn(@Body() signInDto: SigninDto): Promise<IJwtTokens> {
        return this.signinService.signin(signInDto)
    }

    @Post('signout')
    async signOut(@Body('userId') userId: string): Promise<{ message: string }> {
        return this.signoutService.signout(userId);
    }

    @Post('refresh')
    async refreshToken(@Body('refreshToken') refreshToken: string): Promise<IAccessToken> {
        return this.refreshService.handleRefresh(refreshToken);
    }
}
