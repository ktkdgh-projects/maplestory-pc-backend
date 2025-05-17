import { Provider } from '@nestjs/common';
import { RolesRepository, RolesRepositoryToken } from './repository/roles.repository';
import { UserRolesRepository, UserRolesRepositoryToken } from './repository/userRoles.repositoty';
import { RolesService, RolesServiceToken } from './service/roles.service';
import { UserRolesService, UserRolesServiceToken } from './service/user-roles.service';

export const RolesRepositoryProvider: Provider = {
    provide: RolesRepositoryToken,
    useClass: RolesRepository,
};

export const UserRolesRepositoryProvider: Provider = {
    provide: UserRolesRepositoryToken,
    useClass: UserRolesRepository,
};

export const RolesServiceProvider: Provider = {
    provide: RolesServiceToken,
    useClass: RolesService,
};

export const UserRolesServiceProvicer: Provider = {
    provide: UserRolesServiceToken,
    useClass: UserRolesService,
}