export enum RewardRequestStatus {
    PENDING = 'PENDING',
    SUCCESS = 'SUCCESS',
    FAILED = 'FAILED',
}

export enum RewardRequestReason {
    NONE = 'NONE',           
    CONDITION_NOT_MET = 'CONDITION_NOT_MET',
    SYSTEM_ERROR = 'SYSTEM_ERROR',           
    INVALID_EVENT = 'INVALID_EVENT',         
}
