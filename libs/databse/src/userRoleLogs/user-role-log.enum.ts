export enum RoleAction {
    GRANT = 'GRANT',        // 권한 부여
    REVOKE = 'REVOKE',      // 권한 회수
}

export enum RoleChangeReason {
  ADMIN_REQUEST = 'ADMIN_REQUEST',           // 운영자에 의한 직접 권한 요청/명령
  PROMOTION = 'PROMOTION',                   // 역할 승격 (예: USER → OPERATOR)
  DEMOTION = 'DEMOTION',                     // 역할 강등 (예: ADMIN → OPERATOR)
  POLICY_VIOLATION = 'POLICY_VIOLATION',     // 정책 위반으로 인한 권한 회수
  INACTIVITY = 'INACTIVITY',                 // 장기간 비활성으로 인한 권한 회수
  SYSTEM_UPDATE = 'SYSTEM_UPDATE',           // 시스템 정책 변경에 따른 자동 권한 변경
}
