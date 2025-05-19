import { IUserRole } from './user-role.interface';
import { UserRoleDocument } from './user-role.schema';

export const mapUserRoleDoc = (doc: UserRoleDocument): IUserRole => {
    return {
        _id: doc._id,
        id: doc._id.toString(),
        userId: doc.userId,
        roleId: doc.roleId,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};
