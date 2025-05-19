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
        return mapUserRoleDoc(savedUserRole);
    }

    async findUserRoleByUserId(userId: string): Promise<IUserRole | null> {
        const userRole = await this.userRolesModel.findOne({ userId }).populate('roleId').exec();
        return userRole ? mapUserRoleDoc(userRole) : null;
    }

    async findUserRoleByRoleId(roleId: string | null, pageParam: number, limitSize: number): Promise<IUserRole[]> {
        const query = roleId ? { roleId } : {};

        const userRoles = await this.userRolesModel
            .find(query)
            .populate('userId')
            .populate('roleId')
            .skip(pageParam * limitSize)
            .limit(limitSize)
            .exec();

        return userRoles.map((userRole) => mapUserRoleDoc(userRole));
    }

    async updatedUserRole(userId: string, roleId: string, session?: ClientSession): Promise<number> {
        const response = await this.userRolesModel.updateOne({ userId }, { $set: { roleId } }, { session }).exec();
        return response.matchedCount;
    }
}
