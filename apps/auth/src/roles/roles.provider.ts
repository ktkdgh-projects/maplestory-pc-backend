import { Provider } from '@nestjs/common';
import { RolesRepository, RolesRepositoryToken } from './repository/roles.repository';
import { UserRoleLogsRepository, UserRoleLogsRepositoryToken } from './repository/user-role-logs.repository';
import { UserRolesRepository, UserRolesRepositoryToken } from './repository/user-roles.repositoty';
import { ManageUserRolesService, ManageUserRolesServiceToken } from './service/manage-user-roles.service';
import { RolesService, RolesServiceToken } from './service/roles.service';
import { UserRoleLogsService, UserRoleLogsServiceToken } from './service/user-role-logs.service';
import { UserRolesService, UserRolesServiceToken } from './service/user-roles.service';

export const RolesRepositoryProvider: Provider = {
    provide: RolesRepositoryToken,
    useClass: RolesRepository,
};

export const UserRolesRepositoryProvider: Provider = {
    provide: UserRolesRepositoryToken,
    useClass: UserRolesRepository,
};

export const UserRoleLogsRepositoryProvider: Provider = {
    provide: UserRoleLogsRepositoryToken,
    useClass: UserRoleLogsRepository,
};

export const RolesServiceProvider: Provider = {
    provide: RolesServiceToken,
    useClass: RolesService,
};

export const UserRolesServiceProvider: Provider = {
    provide: UserRolesServiceToken,
    useClass: UserRolesService,
};

export const ManageUserRolesServiceProvider: Provider = {
    provide: ManageUserRolesServiceToken,
    useClass: ManageUserRolesService,
};

export const UserRoleLogsServiceProvider: Provider = {
    provide: UserRoleLogsServiceToken,
    useClass: UserRoleLogsService,
};
