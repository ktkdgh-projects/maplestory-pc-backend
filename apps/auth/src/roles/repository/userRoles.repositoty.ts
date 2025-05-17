import { CreateUserRoleDto } from '@libs/common';
import { IUserRole, UserRole, UserRoleDocument, mapUserRoleDoc } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, ClientSession } from 'mongoose';

export const UserRolesRepositoryToken = 'UserRolesRepositoryToken';

@Injectable()
export class UserRolesRepository {
    constructor(
        @InjectModel(UserRole.name) 
        private readonly userRolesModel: Model<UserRoleDocument>,
    ) {}

        async createUserRole(createUserRoleDto: CreateUserRoleDto, session?: ClientSession): Promise<IUserRole> {
            const userRole = new this.userRolesModel({ ...createUserRoleDto });
            const savedUserRole = await userRole.save({ session });
            return mapUserRoleDoc(savedUserRole)
        }

        async findUserRole(userId: string): Promise<IUserRole | null> {
            const userRole = await this.userRolesModel.findOne({ userId }).exec();
            return userRole ? mapUserRoleDoc(userRole) : null;
        }
}
