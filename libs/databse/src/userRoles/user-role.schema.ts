import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';
import { getCurrentDate } from '../utils/time';

export type UserRoleDocument = UserRole & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class UserRole {
    @Prop({ unique: true, ref: 'User', type: SchemaTypes.ObjectId })
    userId: Types.ObjectId;

    @Prop({ ref: 'Role', type: [SchemaTypes.ObjectId] })
    roleId: Types.ObjectId[];

    createdAt: Date;
    updatedAt: Date;
}

export const UserRoleSchema = SchemaFactory.createForClass(UserRole);
