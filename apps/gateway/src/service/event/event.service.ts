import {
    CreateEventDto,
    UpdateEventDto,
    IResEventList,
    IResEventDetail,
    CreateRewardDto,
    IResRewardList,
    UpdateRewardDto,
    IResRewardRequestList,
    IRewardRequestItemList,
    RewardClaimDto,
} from '@libs/common';
import { EventConditionType, RewardRequestStatus } from '@libs/database';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import { firstValueFrom } from 'rxjs';
import { handleHttpError } from '../../common/utils/http-error.util';

export const EventServiceToken = 'EventServiceToken';

@Injectable()
export class EventService {
    private readonly baseUrl = process.env.EVENT_SERVER_URL;

    constructor(private readonly httpService: HttpService) {}

    async createEvent(createEventDto: CreateEventDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.post(`${this.baseUrl}/events`, createEventDto),
            );
            return data;
        } catch (error: any) {
            handleHttpError(error);
        }
    }

    async updateEvent(eventId: string, dto: UpdateEventDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.put(`${this.baseUrl}/events/${eventId}`, { dto }),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async getEvents(userRole: string, pageParam: number): Promise<IResEventList> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IResEventList>>(
                this.httpService.get(`${this.baseUrl}/events`, {
                    headers: { 'x-user-role': userRole },
                    params: { pageParam },
                }),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async getEventDetail(eventId: string, userId: string, role: string): Promise<IResEventDetail> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IResEventDetail>>(
                this.httpService.get(`${this.baseUrl}/events/${eventId}`, {
                    headers: { 'x-user-role': role, 'x-user-id': userId },
                }),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async createReward(createRewardDto: CreateRewardDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.post(`${this.baseUrl}/rewards`, createRewardDto),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async getAllRewards(pageParam: number): Promise<IResRewardList> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IResRewardList>>(
                this.httpService.get(`${this.baseUrl}/rewards`, { params: { pageParam } }),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async updateReward(updateRewardDto: UpdateRewardDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.patch(`${this.baseUrl}/rewards/update`, updateRewardDto),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async getMyRewardRequests(userId: string, pageParam: number): Promise<IResRewardRequestList> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IResRewardRequestList>>(
                this.httpService.get(`${this.baseUrl}/rewards/requests/me`, { params: { userId, pageParam } }),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async getAllRewardRequests(
        pageParam: number,
        status?: RewardRequestStatus,
        conditionType?: EventConditionType,
    ): Promise<IRewardRequestItemList> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<IRewardRequestItemList>>(
                this.httpService.get(`${this.baseUrl}/rewards/requests`, { params: { pageParam, status, conditionType } }),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }

    async claimReward(dto: RewardClaimDto): Promise<{ message: string }> {
        try {
            const { data } = await firstValueFrom<AxiosResponse<{ message: string }>>(
                this.httpService.post(`${this.baseUrl}/events/rewards/claim`, dto),
            );
            return data;
        } catch (error) {
            handleHttpError(error);
        }
    }
}
