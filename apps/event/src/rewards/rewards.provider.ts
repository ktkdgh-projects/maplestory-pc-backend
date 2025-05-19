import { Provider } from '@nestjs/common';
import { RewardsRepository, RewardsRepositoryToken } from './repository/rewards.repository';
import { RewardsReadService, RewardsReadServiceToken } from './service/rewards-read.service';
import { RewardsService, RewardsServiceToken } from './service/rewards.service';

export const RewardsRepositoryProvider: Provider = {
    provide: RewardsRepositoryToken,
    useClass: RewardsRepository,
};

export const RewardsServiceProvider: Provider = {
    provide: RewardsServiceToken,
    useClass: RewardsService,
};

export const RewardsReadServiceProvider: Provider = {
    provide: RewardsReadServiceToken,
    useClass: RewardsReadService,
};
