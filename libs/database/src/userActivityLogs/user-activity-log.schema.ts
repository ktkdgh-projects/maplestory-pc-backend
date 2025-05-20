import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { UserActivityType } from './user-activity-log.enum';

export type UserActivityLogDocument = UserActivityLog & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserActivityLog {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true, type: String, enum: UserActivityType })
    activityType: UserActivityType;

    @Prop({ type: SchemaTypes.ObjectId, ref: 'Event', required: false })
    eventId?: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

export const UserActivityLogschema = SchemaFactory.createForClass(UserActivityLog);
