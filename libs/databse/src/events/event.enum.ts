export enum EventConditionType {
    LOGIN_N_DAYS = 'LOGIN_N_DAYS', // n일 동안 로그인
    INVITE_N_USERS = 'INVITE_N_USERS', // n명 초대 (회원가입 초대)
    EVENT_DETAIL_VIEWS = 'EVENT_DETAIL_VIEWS', // 이벤트 상세조회 횟수
    EVENT_PARTICIPATION_COUNT = 'EVENT_PARTICIPATION_COUNT', // 이벤트 참여 횟수 (보상 받은 횟수)
}

export type ConditionParams =
    | { type: 'LOGIN_N_DAYS'; days: number }
    | { type: 'INVITE_N_USERS'; users: number }
    | { type: 'EVENT_DETAIL_VIEWS'; views: number }
    | { type: 'EVENT_PARTICIPATION_COUNT'; times: number };

export enum EventStatus {
    UPCOMING = 'UPCOMING',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
}
