import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { getCurrentDate } from '../utils/time';

export type UserDocument = User & Document;

@Schema({ versionKey: false, timestamps: { currentTime: getCurrentDate } })
export class User {
    @Prop({ required: true, index: true, unique: true, type: SchemaTypes.String })
    email: string;

    @Prop({ required: true, type: SchemaTypes.String })
    password: string;

    @Prop({ required: true, type: SchemaTypes.String})
    passwordSalt: string;

    @Prop({ index: true, unique: true, type: SchemaTypes.String })
    nickname: string;

    @Prop({ type: SchemaTypes.String, default: 'default' })
    refreshToken: string;

    @Prop({ type: SchemaTypes.String, default: 'default' })
    refreshTokenSalt: string;
    
    createdAt: Date;
    updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
