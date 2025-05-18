import { SignupDto, IUserSummary, SigninDto, IJwtTokens, IJwtPayloadData, IAccessToken, ManageUserRolesDto, IRoleUserList, IRoleUserLogList } from '@libs/common'
import { UserRoleLevel } from '@libs/database';
import { Body, Controller, Get, Inject, Param, Patch, Post, Query, SetMetadata, UseGuards, Headers, ForbiddenException } from '@nestjs/common';
import { AuthUser } from './common/decorator/user.decorator';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RoleGuard } from './common/guards/role.guard';
import { AuthService, AuthServiceToken } from './service/auth/auth.service';

@Controller()
export class AppController {
  constructor(
      @Inject(AuthServiceToken)
      private readonly authService: AuthService,
  ) {}

  @Post('users/signup')
  async signupUser(@Body() signupDto: SignupDto): Promise<{ message: string }> {
    return this.authService.signupUser(signupDto);
  }

  // 추후 수정 예정
  @Get('users/:email')
  async getUserByEmail(@Param('email') email: string): Promise<IUserSummary> {
    return this.authService.getUserByEmail(email);
  }

  @Post('auth/signin')
  async signIn(@Body() signInDto: SigninDto): Promise<IJwtTokens> {
    return this.authService.signin(signInDto)
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
    @Body() manageUserRolesDto: ManageUserRolesDto
  ): Promise<{ message: string }> {
      return this.authService.manageUserRole(user.sub.id, manageUserRolesDto);
  }
  
  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('permission', 'LIMITED_OPERATOR') 
  @Get('roles/users')
  async getUsersByRole(
    @AuthUser() user: IJwtPayloadData, 
    @Query('role') role: UserRoleLevel | 'ALL', 
    @Query('pageParam') pageParam: number
  ):  Promise<IRoleUserList> {
    if (user.role === UserRoleLevel.OPERATOR && role === UserRoleLevel.ADMIN) {
      throw new ForbiddenException('ADMIN 권한 유저는 조회할 수 없습니다.');
    }
    pageParam = isNaN(Number(pageParam)) ? 0 : Number(pageParam);
    return this.authService.getUsersByRole(user.sub.id, role, pageParam);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @SetMetadata('permission', 'ROLE_LOG_VIEW_PRIVILEGED') 
  @Get('roles/logs')
  async getRoleChangeLogs(
      @Query('from') from: string,
      @Query('to') to: string,
      @Query('pageParam') pageParam: number
  ): Promise<IRoleUserLogList> {
      return this.authService.getRoleChangeLogs(from, to, pageParam);
  }
}
