import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { RewardRequestStatus, RewardRequestReason } from './reward-request.enum';

export type RewardRequestDocument = RewardRequest & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class RewardRequest {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ ref: 'Event', type: SchemaTypes.ObjectId })
    eventId: Types.ObjectId;

    @Prop({ required: true, type: String, enum: RewardRequestStatus })
    status: RewardRequestStatus;

    @Prop({ required: true, type: String, enum: RewardRequestReason })
    reason: RewardRequestReason;

    createdAt: Date;
    updatedAt: Date;
}

export const RewardRequestSchema = SchemaFactory.createForClass(RewardRequest);
RewardRequestSchema.index({ userId: 1, eventId: 1 }, { unique: true });
