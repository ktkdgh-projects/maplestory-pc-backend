import { Provider } from '@nestjs/common';
import { UsersRepository, UsersRepositoryToken } from './repository/users.repository';
import { SingupService, SingupServiceToken } from './service/signup.service';
import { UserProfileService, UserProfileServiceToken } from './service/user-profile.service';

export const UsersRepositoryProvider: Provider = {
    provide: UsersRepositoryToken,
    useClass: UsersRepository,
};

export const UserProfileServiceProvider: Provider = {
    provide: UserProfileServiceToken,
    useClass: UserProfileService,
};

export const SingupServiceProvider: Provider = {
    provide: SingupServiceToken,
    useClass: SingupService,
};
