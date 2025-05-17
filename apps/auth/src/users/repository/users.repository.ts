import { SignupDto } from '@libs/common'
import { User, UserDocument, mapUserDoc, IUser } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';

export const UsersRepositoryToken = 'UsersRepositoryToken';

@Injectable()
export class UsersRepository {
    constructor(
        @InjectModel(User.name) 
        private readonly userModel: Model<UserDocument>
    ) {}
    
    async createUser(userData: SignupDto, session?: ClientSession): Promise<IUser> {
        const user = new this.userModel({ ...userData });
        const savedUser = await user.save({ session });
        return mapUserDoc(savedUser)
    }

    async findByEmail(email: string): Promise<IUser | null> {
        const user = await this.userModel.findOne({ email }).exec();
        return user ? mapUserDoc(user) : null;
    }

    async findByEmailOrNickname(email: string, nickname: string): Promise<IUser | null> {
        const user = await this.userModel.findOne({ $or: [{ email }, { nickname }] }).exec();
        return user ? mapUserDoc(user) : null;
    }

}

