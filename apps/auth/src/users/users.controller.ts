import { SignupDto, IUserSummary } from '@libs/common';
import { Controller, Get, Post, Inject, Body, Param } from '@nestjs/common';
import { SignupService, SignupServiceToken } from './service/signup.service';
import { UserProfileService, UserProfileServiceToken } from './service/user-profile.service';

@Controller('users')
export class UsersController {
    constructor(
        @Inject(SignupServiceToken)
        private readonly signupService: SignupService,
        @Inject(UserProfileServiceToken)
        private readonly userProfileService: UserProfileService,
    ) {}

    @Get(':email')
    async getUserByEmail(@Param('email') email: string): Promise<IUserSummary> {
        return this.userProfileService.getUserSummaryByEmail(email);
    }

    @Post('signup')
    async signupUser(@Body() signupDto: SignupDto): Promise<{ message: string }> {
        return this.signupService.signupUser(signupDto);
    }
}
