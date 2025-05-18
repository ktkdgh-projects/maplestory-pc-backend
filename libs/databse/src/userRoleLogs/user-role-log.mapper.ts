import { IUserRoleLog } from './user-role-log.interface';
import { UserRoleLogDocument } from './user-role-log.schema';

export const mapUserRoleLogDoc = (doc: UserRoleLogDocument): IUserRoleLog => {
  return {
    _id: doc._id,
    id: doc._id.toString(),
    userId: doc.userId,
    prevRoleName: doc.prevRoleName,
    newRoleName: doc.newRoleName,
    changedBy: doc.changedBy,
    reason: doc.reason,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};
