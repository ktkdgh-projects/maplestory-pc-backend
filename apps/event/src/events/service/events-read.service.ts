import { IResEvent, IResEventDetail, IResEventList } from '@libs/common';
import { EventConditionType, IEvent, UserRoleLevel } from '@libs/database';
import { BadRequestException, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserActivityLogService, UserActivityLogServiceToken } from '../../user-activity-log/userActivityLog.service';
import { EventsRepository, EventsRepositoryToken } from '../repository/events.repository';

export const EventsReadServiceToken = 'EventsReadServiceToken';

@Injectable()
export class EventsReadService {
    constructor(
        @Inject(EventsRepositoryToken)
        private readonly eventsRepository: EventsRepository,

        @Inject(UserActivityLogServiceToken)
        private readonly userActivityLogService: UserActivityLogService,
    ) {}

    async getEvents(role: string, pageParam: number, limitSize: number): Promise<IResEventList> {
        if (!Object.values(UserRoleLevel).includes(role as UserRoleLevel)) {
            throw new BadRequestException('허용되지 않은 사용자 역할입니다.');
        }
        const events = await this.eventsRepository.getEventsForRole(role, pageParam, limitSize);

        const items: IResEvent[] = events.map((event) => ({
            id: event.id,
            title: event.title,
            description: event.description,
            status: event.status,
        }));

        const isLastPage = events.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    async getEventDetail(eventId: string, userId: string, role: string): Promise<IResEventDetail> {
        if (!Object.values(UserRoleLevel).includes(role as UserRoleLevel)) {
            throw new BadRequestException('허용되지 않은 사용자 역할입니다.');
        }

        const event = await this.eventsRepository.findById(eventId);
        if (!event) {
            throw new BadRequestException('해당 이벤트를 찾지 못했습니다.');
        }

        await this.userActivityLogService.detailActivityLog(userId, eventId);

        const result: IResEventDetail = {
            id: event.id,
            title: event.title,
            description: event.description,
            conditionParams: event.conditionParams
                ? (Object.fromEntries(event.conditionParams) as {
                      type: EventConditionType;
                      days: number;
                  })
                : { type: EventConditionType.LOGIN_N_DAYS, days: 0 },
            startAt: event.startAt,
            endAt: event.endAt,
            status: event.status,
        };

        return result;
    }

    async getEventById(eventId: string): Promise<IEvent> {
        const event = await this.eventsRepository.findById(eventId);
        if (!event) {
            throw new NotFoundException(`이벤트가 존재하지 않습니다.`);
        }

        return event;
    }
}
