import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { UserProfileService, UserProfileServiceToken } from '../../users/service/user-profile.service';


export const SignoutServiceToken = 'SignoutServiceToken';

@Injectable()
export class SignoutService {
    constructor(
        @Inject(UserProfileServiceToken)
        private readonly userProfileService: UserProfileService,
    ) {}

    async signout(userId: string): Promise<{ message: string }>{
        if (!isValidObjectId(userId)) {
            throw new BadRequestException('유효하지 않은 userId 형식입니다.');
        }
        
        await this.userProfileService.updateRefreshToken(userId, 'default', 'default')

        return { message: "로그아웃 완료"}
    }
}
