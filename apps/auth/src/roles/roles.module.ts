import { Role, RoleSchema } from '@libs/database'
import { UserRole, UserRoleSchema } from '@libs/database'
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RolesController } from './roles.controller';
import { RolesRepositoryProvider, RolesServiceProvider, UserRolesRepositoryProvider, UserRolesServiceProvider } from './roles.provider'

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
        MongooseModule.forFeature([{ name: UserRole.name, schema: UserRoleSchema }])
    ],
    controllers: [RolesController],
    providers: [
        RolesRepositoryProvider,
        UserRolesRepositoryProvider, 
        RolesServiceProvider,
        UserRolesServiceProvider
    ],
    exports: [RolesServiceProvider, UserRolesServiceProvider],
})
export class RolesModule {}
