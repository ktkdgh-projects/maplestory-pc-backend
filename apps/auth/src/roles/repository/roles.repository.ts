import { Role, RoleDocument, UserRoleLevel, mapRoleDoc, IRole } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

export const RolesRepositoryToken = 'RolesRepositoryToken';

@Injectable()
export class RolesRepository {
    constructor(
        @InjectModel(Role.name) 
        private readonly roleModel: Model<RoleDocument>,
    ) {}

    async insertMany(roles: Array<Pick<Role, 'name' | 'description'>>): Promise<RoleDocument[]> {
        return this.roleModel.insertMany(roles);
    }

    async count(): Promise<number> {
        return this.roleModel.countDocuments().exec();
    }

    async findByName(name: UserRoleLevel): Promise<IRole | null> {
        const role = await this.roleModel.findOne({ name }).exec();
        return role ? mapRoleDoc(role) : null;
    }
}
