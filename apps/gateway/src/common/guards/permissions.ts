export const Permissions = {
    ADMIN_ONLY: ['ADMIN'],
    LIMITED_OPERATOR: ['OPERATOR', 'ADMIN'],
    ROLE_LOG_VIEW_PRIVILEGED: ['ADMIN', 'AUDITOR'],
    EVENT_MANAGE: ['OPERATOR', 'ADMIN'],
    REWARD_MANAGE: ['OPERATOR', 'ADMIN'],
    ALL_PRIVILEGED_ROLES: ['OPERATOR', 'ADMIN', 'AUDITOR'],
} as const;

export type PermissionKey = keyof typeof Permissions;
