import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { EventStatus } from './event.enum';

export type EventDocument = Event & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Event {
    @Prop({ required: true, type: SchemaTypes.String })
    title: string;

    @Prop({ type: SchemaTypes.String })
    description: string;

    @Prop({ required: true, type: SchemaTypes.Map })
    conditionParams: Map<string, unknown>;

    @Prop({ required: true, type: SchemaTypes.Date })
    startAt: Date;

    @Prop({ required: true, type: SchemaTypes.Date })
    endAt: Date;

    @Prop({ required: true, type: String, enum: EventStatus })
    status: EventStatus;

    createdAt: Date;
    updatedAt: Date;
}

export const EventSchema = SchemaFactory.createForClass(Event);
