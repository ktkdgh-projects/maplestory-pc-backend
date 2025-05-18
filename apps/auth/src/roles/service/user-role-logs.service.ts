import { IUserRoleChangeLog } from '@libs/common'
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { UserRoleLogsRepository, UserRoleLogsRepositoryToken } from '../repository/user-role-logs.repository';

export const UserRoleLogsServiceToken = 'UserRoleLogsServiceToken';

@Injectable()
export class UserRoleLogsService {
    constructor(
        @Inject(UserRoleLogsRepositoryToken)
        private readonly userRoleLogsRepository: UserRoleLogsRepository,

    ) {}

    async getRoleChangeLogs(from: string, to: string, pageParam: number, limitSize: number) {
        const fromDate = this.parseKSTDate(from, true)
        const toDate = this.parseKSTDate(to, false)
        console.log(fromDate, toDate);
        
        const logs = await this.userRoleLogsRepository.findRoleLogsByDateRange(fromDate, toDate, pageParam, limitSize);
        
        const items: IUserRoleChangeLog[] = logs.map((log) => ({
            targetUser: Object(log.userId).nickname,         
            prevRoleName: log.prevRoleName,  
            newRoleName: log.newRoleName,
            changedBy: Object(log.changedBy).nickname,
            reason: log.reason,
            createdAt: log.createdAt,
        }));

        const isLastPage = logs.length < limitSize;
        const nextPage = isLastPage ? undefined : pageParam + 1;

        return { items, nextPage };
    }

    parseKSTDate(dateStr: string, isStart: boolean): Date {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) {
            throw new BadRequestException(`${isStart ? 'from' : 'to'} 날짜 형식이 올바르지 않습니다.`);
        }
        
        isStart ? date.setHours(date.getHours() + 9) :  date.setHours(date.getHours() + 32, 59, 59, 999)
        return date;
    }
};
