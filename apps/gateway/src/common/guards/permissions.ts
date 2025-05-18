export const Permissions = {
    ADMIN_ONLY: ['ADMIN'],
    LIMITED_OPERATOR: ['OPERATOR', 'ADMIN'],  
    ROLE_LOG_VIEW_PRIVILEGED: ['ADMIN', 'AUDITOR'],
} as const;

export type PermissionKey = keyof typeof Permissions;
