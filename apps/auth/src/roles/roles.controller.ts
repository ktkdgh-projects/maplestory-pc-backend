import { IRoleUserList, IRoleUserLogList, ManageUserRolesDto } from '@libs/common';
import { UserRoleLevel } from '@libs/database';
import { Body, Controller, Get, Inject, Patch, Post, Query } from '@nestjs/common';
import { ManageUserRolesService, ManageUserRolesServiceToken } from './service/manage-user-roles.service';
import { RolesService, RolesServiceToken } from './service/roles.service';
import { UserRoleLogsService, UserRoleLogsServiceToken } from './service/user-role-logs.service';
import { UserRolesService, UserRolesServiceToken } from './service/user-roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        @Inject(RolesServiceToken)
        private readonly rolesService: RolesService,
        @Inject(UserRolesServiceToken)
        private readonly userRolesService: UserRolesService,
        @Inject(ManageUserRolesServiceToken)
        private readonly manageUserRolesService: ManageUserRolesService,
        @Inject(UserRoleLogsServiceToken)
        private readonly userRoleLogsService: UserRoleLogsService,
    ) {}

    @Post('init')
    async init(): Promise<{ message: string }> {
        return this.rolesService.initRoles();
    }

    @Patch('manage')
    async manageUserRole(@Body() manageUserRolesDto: ManageUserRolesDto): Promise<{ message: string }> {
        return this.manageUserRolesService.manageUserRole(manageUserRolesDto);
    }

    @Get('users')
    async getUsersByRole(
        @Query('role') role: UserRoleLevel | 'ALL',
        @Query('userId') userId: string,
        @Query('pageParam') pageParam: number,
    ): Promise<IRoleUserList> {
        pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
        return this.userRolesService.getUsersByRole(userId, role, pageParam, 10);
    }

    @Get('logs')
    async getRoleChangeLogs(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('pageParam') pageParam: number,
    ): Promise<IRoleUserLogList> {
        return this.userRoleLogsService.getRoleChangeLogs(from, to, pageParam, 10);
    }
}
