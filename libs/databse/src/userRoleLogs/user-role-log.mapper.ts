import { IUserRoleLog } from './user-role-log.interface';
import { UserRoleLogDocument } from './user-role-log.schema';

export const mapUserRoleLogDoc = (doc: UserRoleLogDocument): IUserRoleLog => {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    roleId: doc.roleId,
    changedBy: doc.changedBy,
    action: doc.action,
    reason: doc.reason,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
