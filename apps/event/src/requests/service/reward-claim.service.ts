import { RewardClaimDto } from '@libs/common';
import { EventConditionType, RewardRequestReason, RewardRequestStatus } from '@libs/database';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { EventsReadService, EventsReadServiceToken } from '../../events/service/events-read.service';
import { RewardsReadService, RewardsReadServiceToken } from '../../rewards/service/rewards-read.service';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { RewardRequestsRepository, RewardRequestsRepositoryToken } from '../repository/reward-requests.repository';
import { UserRewardsRepository, UserRewardsRepositoryToken } from '../repository/user-rewards.repository';

export const RewardClaimServiceToken = 'RewardClaimServiceToken';

@Injectable()
export class RewardClaimService {
    constructor(
        @Inject(RewardRequestsRepositoryToken)
        private readonly rewardRequestsRepository: RewardRequestsRepository,
        @Inject(UserRewardsRepositoryToken)
        private readonly userRewardsRepository: UserRewardsRepository,

        @Inject(EventsReadServiceToken)
        private readonly eventsReadService: EventsReadService,
        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
        @Inject(RewardsReadServiceToken)
        private readonly rewardsReadService: RewardsReadService,
    ) {}

    async claimReward(dto: RewardClaimDto): Promise<{ message: string }> {
        const { userId, eventId } = dto;

        const existingReward = await this.rewardRequestsRepository.findByUserEventId(userId, eventId);
        if (existingReward) {
            throw new BadRequestException('중복으로 요청을 할 수 없습니다.');
        }

        const event = await this.eventsReadService.getEventById(eventId);
        const reward = await this.rewardsReadService.getRewardByEventId(eventId);

        let conditionType;
        let conditionValue;

        if (event.conditionParams instanceof Map) {
            conditionType = event.conditionParams.get('type') as EventConditionType;
            switch (conditionType) {
                case 'LOGIN_N_DAYS':
                    conditionValue = event.conditionParams.get('days');
                    break;
                case 'INVITE_N_USERS':
                    conditionValue = event.conditionParams.get('users');
                    break;
                case 'EVENT_DETAIL_VIEWS':
                    conditionValue = event.conditionParams.get('views');
                    break;
                case 'EVENT_PARTICIPATION_COUNT':
                    conditionValue = event.conditionParams.get('times');
                    break;
                default:
                    throw new Error('지원하지 않는 조건 타입입니다.');
            }
        }

        const isEligible = await this.checkCondition(userId, conditionType as EventConditionType, conditionValue as number);

        const status = isEligible ? RewardRequestStatus.SUCCESS : RewardRequestStatus.FAILED;
        const reason = isEligible ? RewardRequestReason.NONE : RewardRequestReason.CONDITION_NOT_MET;

        await this.rewardRequestsRepository.createRewardRequest({ ...dto, status, reason });
        if (isEligible) {
            await this.userRewardsRepository.createUserReward(userId, eventId, reward.id);
            await this.userActivityLogService.rewardActivityLog(userId, eventId);
        }

        return { message: '요청이 성공적으로 등록되었습니다.' };
    }

    private async checkCondition(userId: string, conditionType: EventConditionType, conditionValue: number): Promise<boolean> {
        switch (conditionType) {
            case EventConditionType.LOGIN_N_DAYS:
                return (await this.userActivityLogService.countLoginDays(userId)) >= conditionValue;
            case EventConditionType.INVITE_N_USERS:
                return (await this.userActivityLogService.countInvitedUsers(userId)) >= conditionValue;
            case EventConditionType.EVENT_DETAIL_VIEWS:
                return (await this.userActivityLogService.countEventViews(userId)) >= conditionValue;
            case EventConditionType.EVENT_PARTICIPATION_COUNT:
                return (await this.userActivityLogService.countEventParticipations(userId)) >= conditionValue;
            default:
                return false;
        }
    }
}
