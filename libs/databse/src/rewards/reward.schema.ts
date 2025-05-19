import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { RewardType } from './reward.enum';

export type RewardDocument = Reward & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class Reward {
    @Prop({ref: 'Event', type: SchemaTypes.ObjectId })
    eventId: Types.ObjectId;

    @Prop({ required: true, type: String, enum: RewardType })
    rewardType: RewardType;

    @Prop({ type: SchemaTypes.String})
    description: string;

    @Prop({ required: true, type: SchemaTypes.Number})
    amount: number

    createdAt: Date;
    updatedAt: Date;
}

export const RewardSchema = SchemaFactory.createForClass(Reward);
