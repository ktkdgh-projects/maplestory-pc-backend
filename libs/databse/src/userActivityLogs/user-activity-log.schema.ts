import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { UserActionType } from './user-activity-log.enum';

export type UserActivityLogDocument = UserActivityLog & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserActivityLog {
    @Prop({ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true, type: String, enum: UserActionType })
    actionType: UserActionType;
    
    @Prop({ required: true, type: SchemaTypes.Map })
    metadata: Map<string, unknown>;

    createdAt: Date;
    updatedAt: Date;
}

export const UserActivityLogchema = SchemaFactory.createForClass(UserActivityLog);
