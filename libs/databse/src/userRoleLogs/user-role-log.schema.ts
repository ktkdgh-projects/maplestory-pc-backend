import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from '../roles';
import { User } from '../users';
import { getCurrentDate } from '../utils/time';
import { RoleAction, RoleChangeReason } from './user-role-log.enum';


export type UserRoleLogDocument = UserRoleLog & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserRoleLog {
    @Prop({ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'Role', type: SchemaTypes.ObjectId })
    roleId: Role;

    @Prop({ref: 'User', type: SchemaTypes.ObjectId })
    changedBy: User;

    @Prop({ required: true, enum: RoleAction })
    action: RoleAction;

    @Prop({ required: true, enum: RoleChangeReason  })
    reason: RoleChangeReason;

    createdAt: Date;
    updatedAt: Date;
}

export const UserRoleLogSchema = SchemaFactory.createForClass(UserRoleLog);
