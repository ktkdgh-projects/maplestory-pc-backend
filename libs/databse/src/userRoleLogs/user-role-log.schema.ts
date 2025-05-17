import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';
import { RoleAction, RoleChangeReason } from './user-role-log.enum';

export type UserRoleLogDocument = UserRoleLog & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserRoleLog {
    @Prop({ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ ref: 'Role', type: SchemaTypes.ObjectId })
    roleId: Types.ObjectId;

    @Prop({ref: 'User', type: SchemaTypes.ObjectId })
    changedBy: Types.ObjectId;

    @Prop({ required: true, enum: RoleAction })
    action: RoleAction;

    @Prop({ required: true, enum: RoleChangeReason  })
    reason: RoleChangeReason;

    createdAt: Date;
    updatedAt: Date;
}

export const UserRoleLogSchema = SchemaFactory.createForClass(UserRoleLog);
