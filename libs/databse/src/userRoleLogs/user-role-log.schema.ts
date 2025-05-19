import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { UserRoleLevel } from '../roles';
import { getCurrentDate } from '../utils/time';
import { RoleChangeReason } from './user-role-log.enum';

export type UserRoleLogDocument = UserRoleLog & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserRoleLog {
    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ required: true, type: String, enum: UserRoleLevel })
    prevRoleName: UserRoleLevel;

    @Prop({ required: true, type: String, enum: UserRoleLevel })
    newRoleName: UserRoleLevel;

    @Prop({ ref: 'User', type: SchemaTypes.ObjectId })
    changedBy: Types.ObjectId;

    @Prop({ required: true, enum: RoleChangeReason })
    reason: RoleChangeReason;

    createdAt: Date;
    updatedAt: Date;
}

export const UserRoleLogSchema = SchemaFactory.createForClass(UserRoleLog);
