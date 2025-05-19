import {
    SignupDto,
    IUserSummary,
    SigninDto,
    IJwtTokens,
    IJwtPayloadData,
    IAccessToken,
    ManageUserRolesDto,
    IRoleUserList,
    IRoleUserLogList,
    CreateEventDto,
    UpdateEventDto,
    IResEventList,
    IResEventDetail,
    CreateRewardDto,
    IResRewardList,
    UpdateRewardDto,
    IResRewardRequestList,
    RewardClaimDto,
    IRewardRequestItemList,
} from '@libs/common';
import { EventConditionType, RewardRequestStatus, UserRoleLevel } from '@libs/database';
import {
    Body,
    Controller,
    Get,
    Inject,
    Param,
    Patch,
    Post,
    Query,
    SetMetadata,
    UseGuards,
    Headers,
    ForbiddenException,
    Put,
} from '@nestjs/common';
import { AuthUser } from './common/decorator/user.decorator';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RoleGuard } from './common/guards/role.guard';
import { AuthService, AuthServiceToken } from './service/auth/auth.service';
import { EventService, EventServiceToken } from './service/event/event.service';

@Controller()
export class AppController {
    constructor(
        @Inject(AuthServiceToken)
        private readonly authService: AuthService,
        @Inject(EventServiceToken)
        private readonly eventService: EventService,
    ) {}

    @Post('users/signup')
    async signupUser(@Body() signupDto: SignupDto): Promise<{ message: string }> {
        return this.authService.signupUser(signupDto);
    }

    @Get('users/:email')
    async getUserByEmail(@Param('email') email: string): Promise<IUserSummary> {
        return this.authService.getUserByEmail(email);
    }

    @Post('auth/signin')
    async signIn(@Body() signInDto: SigninDto): Promise<IJwtTokens> {
        return this.authService.signin(signInDto);
    }

    @UseGuards(JwtAuthGuard)
    @Post('auth/signout')
    async signOut(@AuthUser() user: IJwtPayloadData): Promise<{ message: string }> {
        return this.authService.signout(user.sub.id);
    }

    @Post('auth/refresh')
    async refreshToken(@Headers('authorization') authorizationHeader: string): Promise<IAccessToken> {
        const refreshToken = authorizationHeader?.split('Bearer ')[1];
        return this.authService.handleRefresh(refreshToken);
    }

    @Post('roles/init')
    async init(): Promise<{ message: string }> {
        return this.authService.initRoles();
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'ADMIN_ONLY')
    @Patch('roles/manage')
    async manageUserRole(
        @AuthUser() user: IJwtPayloadData,
        @Body() manageUserRolesDto: ManageUserRolesDto,
    ): Promise<{ message: string }> {
        return this.authService.manageUserRole(user.sub.id, manageUserRolesDto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'LIMITED_OPERATOR')
    @Get('roles/users')
    async getUsersByRole(
        @AuthUser() user: IJwtPayloadData,
        @Query('role') role: UserRoleLevel | 'ALL',
        @Query('pageParam') pageParam: number,
    ): Promise<IRoleUserList> {
        if (user.role === UserRoleLevel.OPERATOR && role === UserRoleLevel.ADMIN) {
            throw new ForbiddenException('ADMIN 권한 유저는 조회할 수 없습니다.');
        }
        return this.authService.getUsersByRole(user.sub.id, role, pageParam);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'ROLE_LOG_VIEW_PRIVILEGED')
    @Get('roles/logs')
    async getRoleChangeLogs(
        @Query('from') from: string,
        @Query('to') to: string,
        @Query('pageParam') pageParam: number,
    ): Promise<IRoleUserLogList> {
        return this.authService.getRoleChangeLogs(from, to, pageParam);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'EVENT_MANAGE')
    @Post('events')
    async createEvent(@Body() dto: CreateEventDto): Promise<{ message: string }> {
        return this.eventService.createEvent(dto);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'EVENT_MANAGE')
    @Put('events/:id')
    async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<{ message: string }> {
        return this.eventService.updateEvent(id, dto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('events')
    async getEvents(@AuthUser() user: IJwtPayloadData, @Query('pageParam') pageParam: number): Promise<IResEventList> {
        console.log(user.role);

        return this.eventService.getEvents(user.role, pageParam);
    }

    @UseGuards(JwtAuthGuard)
    @Get('events/:eventId')
    async getEventDetail(@AuthUser() user: IJwtPayloadData, @Param('eventId') eventId: string): Promise<IResEventDetail> {
        return this.eventService.getEventDetail(eventId, user.sub.id, user.role);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'REWARD_MANAGE')
    @Post('rewards')
    async createReward(@Body() createRewardDto: CreateRewardDto): Promise<{ message: string }> {
        return this.eventService.createReward(createRewardDto);
    }

    @UseGuards(JwtAuthGuard)
    @SetMetadata('permission', 'REWARD_MANAGE')
    @Get('rewards')
    async getAllRewards(@Query('pageParam') pageParam: number): Promise<IResRewardList> {
        return this.eventService.getAllRewards(pageParam);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'REWARD_MANAGE')
    @Patch('rewards/update')
    async updateReward(@Body() updateRewardDto: UpdateRewardDto): Promise<{ message: string }> {
        return this.eventService.updateReward(updateRewardDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get('rewards/requests/me')
    async getMyRewardRequests(
        @AuthUser() user: IJwtPayloadData,
        @Query('pageParam') pageParam: number,
    ): Promise<IResRewardRequestList> {
        return this.eventService.getMyRewardRequests(user.sub.id, pageParam);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @SetMetadata('permission', 'ALL_PRIVILEGED_ROLES')
    @Get('rewards/requests')
    async getAllRewardRequests(
        @Query('pageParam') pageParam: number,
        @Query('status') status?: RewardRequestStatus,
        @Query('conditionType') conditionType?: EventConditionType,
    ): Promise<IRewardRequestItemList> {
        return this.eventService.getAllRewardRequests(pageParam, status, conditionType);
    }

    @UseGuards(JwtAuthGuard)
    @Post('events/rewards/claim')
    async claimReward(@Body() dto: RewardClaimDto): Promise<{ message: string }> {
        return this.eventService.claimReward(dto);
    }
}
