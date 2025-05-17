import { Controller, Inject, Post } from '@nestjs/common';
import { RolesService, RolesServiceToken } from './service/roles.service';

@Controller('roles')
export class RolesController {
    constructor(
        @Inject(RolesServiceToken)
        private readonly rolesService: RolesService,
    ) {}

    @Post('init')
    async init(): Promise<{ message: string }>  {
        return this.rolesService.initRoles();
    }
}
