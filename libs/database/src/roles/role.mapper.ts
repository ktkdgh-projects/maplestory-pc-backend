import { IRole } from './role.interface';
import { RoleDocument } from './role.schema';

export const mapRoleDoc = (doc: RoleDocument): IRole => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        name: doc.name,
        description: doc.description,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
