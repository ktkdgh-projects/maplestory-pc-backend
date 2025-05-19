import { CreateEventDto, IResEventDetail, IResEventList, UpdateEventDto } from '@libs/common';
import { Controller, Post, Put, Body, Param, Inject, Get, Headers, Query } from '@nestjs/common';
import { EventsManageService, EventsManageServiceToken } from './service/events-manage.service';
import { EventsReadService, EventsReadServiceToken } from './service/events-read.service';

@Controller('events')
export class EventsController {
    constructor(
        @Inject(EventsManageServiceToken)
        private readonly eventsManageService: EventsManageService,
        @Inject(EventsReadServiceToken)
        private readonly eventsReadService: EventsReadService,
    ) {}

    @Post()
    async createEvent(@Body() dto: CreateEventDto): Promise<{ message: string }> {
        return this.eventsManageService.createEvent(dto);
    }

    @Put(':id')
    async updateEvent(@Param('id') id: string, @Body() dto: UpdateEventDto): Promise<{ message: string }> {
        return this.eventsManageService.updateEvent(id, dto);
    }

    @Get()
    async getEvents(@Headers('x-user-role') userRole: string, @Query('pageParam') pageParam: number): Promise<IResEventList> {
        return this.eventsReadService.getEvents(userRole, pageParam, 10);
    }

    @Get(':eventId')
    async getEventDetail(
        @Param('eventId') eventId: string,
        @Headers('x-user-role') userRole: string,
        @Headers('x-user-id') userId: string,
    ): Promise<IResEventDetail> {
        return this.eventsReadService.getEventDetail(eventId, userId, userRole);
    }
}
