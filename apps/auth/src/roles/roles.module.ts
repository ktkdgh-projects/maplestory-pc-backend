import { Role, RoleSchema, UserRoleLog, UserRoleLogSchema } from '@libs/database'
import { UserRole, UserRoleSchema } from '@libs/database'
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { 
    ManageUserRolesServiceProvider, 
    RolesRepositoryProvider, 
    RolesServiceProvider, 
    UserRoleLogsRepositoryProvider, 
    UserRolesRepositoryProvider, 
    UserRolesServiceProvider,
    UserRoleLogsServiceProvider
} from './roles.provider'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }]),
        MongooseModule.forFeature([{ name: UserRoleLog.name, schema: UserRoleLogSchema }])
    ],
    controllers: [RolesController],
    providers: [
        RolesRepositoryProvider,
        UserRolesRepositoryProvider, 
        UserRoleLogsRepositoryProvider,
        RolesServiceProvider,
        UserRolesServiceProvider,
        UserRoleLogsServiceProvider,
        ManageUserRolesServiceProvider,
    ],
    exports: [RolesServiceProvider, UserRolesServiceProvider, ManageUserRolesServiceProvider, UserRoleLogsServiceProvider],
})
export class RolesModule {}
