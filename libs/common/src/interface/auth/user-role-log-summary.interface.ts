import { UserRoleLevel, RoleChangeReason } from '@libs/database'

export interface IUserRoleChangeLog {
    targetUser: string;         
    prevRoleName: UserRoleLevel;  
    newRoleName: UserRoleLevel;   
    changedBy: string;      
    reason: RoleChangeReason;
    createdAt: Date;         
}

export interface IRoleUserLogList {
    items: IUserRoleChangeLog[];
    nextPage?: number;
}
