import { UserRoleLevel } from '@libs/database';

export interface IRoleUserSummary {
    userId: string;     
    email: string;
    nickname: string;
    name: UserRoleLevel;   
    isMe: boolean;
}