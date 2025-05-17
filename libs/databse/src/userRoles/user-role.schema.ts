import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { Role } from "../roles";
import { User } from '../users'
import { getCurrentDate } from '../utils/time';

export type UserRoleDocument = UserRole & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserRole {
    @Prop({ref: 'User', type: SchemaTypes.ObjectId })
    userId: User;

    @Prop({ ref: 'Role', type: SchemaTypes.ObjectId })
    roleId: Role;

    createdAt: Date;
    updatedAt: Date;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
