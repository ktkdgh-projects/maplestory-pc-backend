import { CreateEventDto, UpdateEventDto } from '@libs/common';
import { EventStatus } from '@libs/database';
import { BadRequestException, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { isValidObjectId } from 'mongoose';
import { EventsRepository, EventsRepositoryToken } from '../repository/events.repository';

export const EventsManageServiceToken = 'EventsManageServiceToken';

@Injectable()
export class EventsManageService {
    constructor(
        @Inject(EventsRepositoryToken)
        private readonly eventsRepository: EventsRepository,
    ) {}

    async createEvent(createEventDto: CreateEventDto): Promise<{ message: string }> {
        const { startAt, endAt } = createEventDto;

        const start = new Date(startAt).getTime();
        const end = new Date(endAt).getTime();
        const now = Date.now();

        if (start >= end) {
            throw new BadRequestException('시작일시는 종료일시보다 이전이어야 합니다.');
        }

        const status = start <= now ? EventStatus.ACTIVE : EventStatus.UPCOMING;
        const eventDto: CreateEventDto = { ...createEventDto, status };
        await this.eventsRepository.createEvent(eventDto);

        return { message: '이벤트 등록 완료' };
    }

    async updateEvent(eventId: string, updateEventDto: UpdateEventDto): Promise<{ message: string }> {
        if (!isValidObjectId(eventId)) {
            throw new BadRequestException('유효하지 않은 ObjectId 형식입니다.');
        }

        const existingEvent = await this.eventsRepository.findById(eventId);
        if (!existingEvent) {
            throw new NotFoundException('해당 이벤트를 찾을 수 없습니다.');
        }

        const start = updateEventDto.startAt
            ? new Date(updateEventDto.startAt).getTime()
            : new Date(existingEvent.startAt).getTime();

        const end = updateEventDto.endAt ? new Date(updateEventDto.endAt).getTime() : new Date(existingEvent.endAt).getTime();

        const now = Date.now();

        if (start >= end) {
            throw new BadRequestException('시작일은 종료일보다 이전이어야 합니다.');
        }

        const status = start <= now ? EventStatus.ACTIVE : EventStatus.UPCOMING;

        const result = await this.eventsRepository.updateEvent(eventId, { ...updateEventDto, status });
        if (result === 0) {
            throw new InternalServerErrorException('이벤트 변경에 실패했습니다');
        }

        return { message: '이벤트가 성공적으로 수정되었습니다.' };
    }
}
