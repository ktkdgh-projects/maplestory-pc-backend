import { Provider } from '@nestjs/common';
import { RewardRequestsRepository, RewardRequestsRepositoryToken } from './repository/reward-requests.repository';
import { UserRewardsRepository, UserRewardsRepositoryToken } from './repository/user-rewards.repository';
import { RewardClaimService, RewardClaimServiceToken } from './service/reward-claim.service';
import { RewardRequestsService, RewardRequestsServiceToken } from './service/reward-requests.service';

export const RewardRequestsRepositoryProvider: Provider = {
    provide: RewardRequestsRepositoryToken,
    useClass: RewardRequestsRepository,
};

export const UserRewardsRepositoryProvider: Provider = {
    provide: UserRewardsRepositoryToken,
    useClass: UserRewardsRepository,
};

export const RewardClaimServiceProvider: Provider = {
    provide: RewardClaimServiceToken,
    useClass: RewardClaimService,
};

export const RewardRequestsServiceProvider: Provider = {
    provide: RewardRequestsServiceToken,
    useClass: RewardRequestsService,
};
