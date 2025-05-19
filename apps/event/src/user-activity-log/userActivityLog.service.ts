import { UserActivityType } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { UserActivityLogRepository } from './userActivityLog.repository';

export const UserActivityLogServiceToken = 'UserActivityLogServiceToken';

@Injectable()
export class UserActivityLogService {
    constructor(private readonly userActivityLogRepository: UserActivityLogRepository) {}

    async detailActivityLog(userId: string, eventId: string): Promise<void> {
        const log = await this.userActivityLogRepository.findByUserEventId(userId, eventId);
        if (!log) {
            await this.userActivityLogRepository.createUserActivityLog({
                userId,
                eventId,
                activityType: UserActivityType.EVENT_VIEW,
            });
        }
    }

    async rewardActivityLog(userId: string, eventId: string): Promise<void> {
        const log = await this.userActivityLogRepository.findByUserEventId(userId, eventId);
        if (!log) {
            await this.userActivityLogRepository.createUserActivityLog({
                userId,
                eventId,
                activityType: UserActivityType.EVENT_PARTICIPATE,
            });
        }
    }

    async countLoginDays(userId: string): Promise<number> {
        const result = await this.userActivityLogRepository.findLoginByUserId(userId);

        if (result.length === 0) {
            return 0;
        }

        const loginDates = result.map((log) => new Date(log.createdAt)).sort((a, b) => a.getTime() - b.getTime());

        let maxStreak = 1;
        let currentStreak = 1;

        for (let i = 1; i < loginDates.length; i++) {
            const diffDays = (loginDates[i].getTime() - loginDates[i - 1].getTime()) / (1000 * 60 * 60 * 24);
            if (diffDays === 1) {
                currentStreak++;
                maxStreak = Math.max(maxStreak, currentStreak);
            } else if (diffDays > 1) {
                currentStreak = 1;
            }
        }

        return maxStreak;
    }

    async countInvitedUsers(userId: string): Promise<number> {
        return this.userActivityLogRepository.count(UserActivityType.INVITE, userId);
    }

    async countEventViews(userId: string): Promise<number> {
        return this.userActivityLogRepository.count(UserActivityType.EVENT_VIEW, userId);
    }

    async countEventParticipations(userId: string): Promise<number> {
        return this.userActivityLogRepository.count(UserActivityType.EVENT_PARTICIPATE, userId);
    }
}
