import { SignupDto, IUserSummary, SigninDto, IJwtTokens, IAccessToken, ManageUserRolesDto, IRoleUserLogList, IRoleUserList } from '@libs/common';
import { UserRoleLevel } from '@libs/database';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { handleHttpError } from '../../common/utils/http-error.util';

export const AuthServiceToken = 'AuthServiceToken';

@Injectable()
export class AuthService {
    private readonly baseUrl = process.env.AUTH_SERVER_URL;

    constructor(private readonly httpService: HttpService) {}

    async signupUser(signupDto: SignupDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.post(`${this.baseUrl}/users/signup`, signupDto),
            );
            return data;
        } catch (error: any) {
            handleHttpError(error)
        }
    }

    async getUserByEmail(email: string): Promise<IUserSummary> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IUserSummary>>(
                this.httpService.get(`${this.baseUrl}/users/${encodeURIComponent(email)}`),
            );
            return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async signin(signInDto: SigninDto): Promise<IJwtTokens> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IJwtTokens>>(
                this.httpService.post(`${this.baseUrl}/auth/signin`, signInDto),
            );
            return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async signout(userId: string): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.post(`${this.baseUrl}/auth/signout`, { userId }),
            );
            return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async handleRefresh(refreshToken: string): Promise<IAccessToken>  {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IAccessToken>>(
                this.httpService.post(`${this.baseUrl}/auth/refresh`, { refreshToken }),
            );
            return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async initRoles(): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.post(`${this.baseUrl}/roles/init`),
            );
        return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async manageUserRole(userId: string, manageUserRolesDto: ManageUserRolesDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.patch(`${this.baseUrl}/roles/manage`, { ...manageUserRolesDto, changedBy: userId}),
            );
        return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async getUsersByRole(
        userId: string, 
        role: UserRoleLevel | 'ALL', 
        pageParam: number
    ): Promise<IRoleUserList> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IRoleUserList>>(
                this.httpService.get(`${this.baseUrl}/roles/users`, { params: { userId, role, pageParam }}),
            );
        return data;
        } catch (error) {
            handleHttpError(error)
        }
    }

    async getRoleChangeLogs(
        from: string, 
        to: string, 
        pageParam: number
    ): Promise<IRoleUserLogList> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IRoleUserLogList>>(
                this.httpService.patch(`${this.baseUrl}/roles/logs`, { params: { from, to, pageParam }}),
            );
        return data;
        } catch (error) {
            handleHttpError(error)
        }
    }
}
