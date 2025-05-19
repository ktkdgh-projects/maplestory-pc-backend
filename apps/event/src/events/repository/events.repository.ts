import { Event, EventDocument, EventStatus, IEvent, mapEventDoc } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateEventDto, UpdateEventDto } from 'libs/common/dist';
import { Model } from 'mongoose';

export const EventsRepositoryToken = 'EventsRepositoryToken';

@Injectable()
export class EventsRepository {
    constructor(
        @InjectModel(Event.name)
        private readonly eventModel: Model<EventDocument>,
    ) {}

    async createEvent(dto: CreateEventDto): Promise<IEvent> {
        const event = new this.eventModel({ ...dto });
        const savedEvent = await event.save();
        return mapEventDoc(savedEvent);
    }

    async findById(_id: string): Promise<IEvent | null> {
        const event = await this.eventModel.findOne({ _id }).exec();
        return event ? mapEventDoc(event) : null;
    }

    async updateEvent(_id: string, updateEventDto: UpdateEventDto): Promise<number> {
        const response = await this.eventModel.updateOne({ _id }, { $set: { ...updateEventDto } }).exec();
        return response.matchedCount;
    }

    async getEventsForRole(role: string, pageParam: number, limitSize: number): Promise<IEvent[]> {
        const isUser = role === 'USER';
        const query = isUser ? { status: EventStatus.ACTIVE } : {};

        const events = await this.eventModel
            .find(query)
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();
        return events.map((event) => mapEventDoc(event));
    }
}
