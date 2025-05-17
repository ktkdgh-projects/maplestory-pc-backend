import { SignupDto, IUserSummary } from '@libs/common'
import { Controller, Get, Post, Inject, Body, Param } from '@nestjs/common';
import { SingupService, SingupServiceToken } from './service/signup.service';
import { UserProfileService, UserProfileServiceToken } from './service/user-profile.service';

@Controller('users')
export class UsersController {
    constructor(
        @Inject(SingupServiceToken)
        private readonly singupService: SingupService,
        @Inject(UserProfileServiceToken)
        private readonly userProfileService: UserProfileService
    ) {}

    @Get(':email')
    async getUserByEmail(@Param('email') email: string): Promise<IUserSummary> {
        return this.userProfileService.getUserByEmail(email)
    }

    @Post('signup')
    async signupUser(@Body() signupDto: SignupDto): Promise<{ message: string }> {
        return this.singupService.signupUser(signupDto)
    }
}
