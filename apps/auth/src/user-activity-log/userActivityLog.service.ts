import { UserActivityLogDto } from '@libs/common';
import { Injectable } from '@nestjs/common';
import { UserActivityLogRepository } from './userActivityLog.repository';

export const UserActivityLogServiceToken = 'UserActivityLogServiceToken';

@Injectable()
export class UserActivityLogService {
    constructor(private readonly userActivityLogRepository: UserActivityLogRepository) {}

    async signinActivityLog(logDTO: UserActivityLogDto): Promise<void> {
        const existingLog = await this.userActivityLogRepository.findByUserId(logDTO.userId);
        if (!existingLog) {
            await this.userActivityLogRepository.createUserActivityLog(logDTO);
        }
    }

    async signupActivityLog(logDTO: UserActivityLogDto): Promise<void> {
        await this.userActivityLogRepository.createUserActivityLog(logDTO);
    }
}
