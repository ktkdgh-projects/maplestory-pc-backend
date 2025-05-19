export enum EventConditionType {
    LOGIN_N_DAYS = 'LOGIN_N_DAYS',
    INVITE_N_USERS = 'INVITE_N_USERS',
    PURCHASE_OVER_AMOUNT = 'PURCHASE_OVER_AMOUNT',
    COMPLETE_N_MISSIONS = 'COMPLETE_N_MISSIONS',
    LEVEL_REACHED = 'LEVEL_REACHED',
}

export type ConditionParams =
    | { type: 'LOGIN_N_DAYS'; days: number }
    | { type: 'INVITE_N_USERS'; count: number }
    | { type: 'PURCHASE_OVER_AMOUNT'; amount: number }
    | { type: 'COMPLETE_N_MISSIONS'; count: number }
    | { type: 'LEVEL_REACHED'; level: number };

export enum EventStatus {
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
}