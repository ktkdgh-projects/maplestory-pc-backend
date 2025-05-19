import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';

export type UserRewardDocument = UserReward & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserReward {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ ref: 'Event', type: SchemaTypes.ObjectId })
    eventId: Types.ObjectId;

    @Prop({ ref: 'Reward', type: SchemaTypes.ObjectId })
    rewardId: Types.ObjectId;

    createdAt: Date;
    updatedAt: Date;
}

export const UserRewardSchema = SchemaFactory.createForClass(UserReward);
