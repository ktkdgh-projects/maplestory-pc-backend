- 도커 환경 구성은 완료하지 못했습니다. 프로젝트를 클론한 후 서버 실행 과정에서 예상치 못한 오류들이 발생했고, 
  제한된 시간 내에 모두 해결하기 어려워 현재 구현된 부분까지만 제출드립니다. 이후에도 문제 해결과 보완을 이어갈 계획입니다.

---------------------------------------------------------------------------------------------------
## 실행 방법(제출 기한 지나고 수정한 내용입니다.)

현재 Docker 환경에서는 실행이 불가능한 상태입니다. 로컬 실행 방법을 알려드리겠습니다.

### 로컬환경에서 실행방법
1. 레포지토리 클론

  ```bash
  git clone https://github.com/ktkdgh-projects/maplestory-pc-backend.git
  ```
2. 패키지 설치
  ```
  yarn install
  ```
3. 전체 패키지 빌드
```
yarn build:all
```
4. mongodb 스크립트 
```
yarn init:docker
```
5. 각각의 터미널에서 실행해주세요.
```
yarn dev:auth 
yarn dev:event
yarn dev:gateway

```
.env 파일은 프로젝트 루트 경로에 생성해주시면 됩니다. (예: /your-project/.env)

```

# MongoDB 연결 URI 예시
MONGODB_URI="mongodb://<username>:<password>@<host1>:<port1>,<host2>:<port2>,<host3>:<port3>/?authSource=admin&replicaSet=<replicaSetName>"

# JWT 설정 예시
JWT_SECRET_KEY="your_jwt_secret_key"
JWT_ACCESS_SECRET_KEY="your_access_token_secret_key"
JWT_REFRESH_SECRET_KEY="your_refresh_token_secret_key"
JWT_ACCESS_TOKEN_TIME="2h"
JWT_REFRESH_TOKEN_TIME="14d"

# pbkdf2 설정 예시
INTERATIONS="100"
DKLEN="64"
HASH="sha256"

# 서버 url
AUTH_SERVER_URL="http://localhost:3001/api"
EVENT_SERVER_URL="http://localhost:3002/api"

```


##  Database Schema

###  주요 도메인 및 설명

| 도메인            | 설명 |
|------------------|------|
| `User`           | 회원 정보를 저장합니다. 이메일, 비밀번호, 닉네임 등을 포함합니다. |
| `Role`           | 유저 권한 레벨 정보를 관리합니다. |
| `UserRole`       | 유저와 역할을 연결하는 테이블입니다. (1:1 관계) |
| `UserRoleLog`    | 유저 권한 변경 이력을 기록합니다. |
| `Event`          | 특정 기간 동안 진행되는 이벤트 정보입니다. 조건, 상태 등을 포함합니다. |
| `Reward`         | 이벤트에 대한 보상 정보를 담고 있습니다. (이벤트와 1:1 매핑) |
| `RewardRequest`  | 유저가 리워드를 요청한 이력을 기록합니다. |
| `UserReward`     | 실제로 유저에게 지급된 리워드 정보를 저장합니다. |
| `UserActivityLog`| 유저의 활동 기록을 저장합니다. 이벤트 기반 활동 등이 포함됩니다. |

---

###  스키마 요약

####  User
- `email`, `nickname`: 고유값 (`unique`)
- `password`, `passwordSalt`: 비밀번호 보안을 위한 필드
- `refreshToken`, `refreshTokenSalt`: 인증 리프레시 토큰 관련 필드
- `inviteCode`: 선택적 고유값 (`unique`)

####  Role 
- 권한의 이름(name: UserRoleLevel enum)과 권한에 대한 설명(description)을 저장하는 스키마입니다.
- 시스템에서 사용할 역할을 정의하며, 권한 수준에 따른 구분을 명확히 합니다.


####  UserRole 
- 유저(userId)와 역할(roleId)을 1:1로 연결하는 스키마입니다.
- 한 명의 유저는 하나의 역할을 가질 수 있으며, 역할 변경 시 이 테이블을 업데이트합니다.
- **UserRole**: 유저와 역할 간의 1:1 연결

####  UserRoleLog 
- 이전 역할(prevRoleName), 새 역할(newRoleName), 권한 변경을 수행한 관리자(changedBy), 그리고 변경 사유(reason: RoleChangeReason enum)를 저장합니다.
- **UserRole**: 유저와 역할 간의 1:1 연결
- **UserRoleLog**: 권한 변경에 대한 로그 기록 (`prevRoleName`, `newRoleName`, `changedBy`, `reason` 등)
Role

#### Event
- 필드: `title`, `description`, `conditionParams`, `startAt`, `endAt`, `status`
- `status`: `EventStatus` enum 기반

#### Reward
- 이벤트(`eventId`)와 1:1로 연결 (`unique`)
- 필드: `rewardType`, `description`, `amount`

####  RewardRequest
- 유저가 리워드를 요청한 이력
- 복합 유니크 인덱스: `(userId, eventId)`
- 필드: `status`, `reason`

####  UserReward
- 유저에게 실제로 지급된 리워드 정보
- 외래키: `userId`, `eventId`, `rewardId`

####  UserActivityLog
- 유저 활동에 대한 로그
- 특정 이벤트(`eventId`)에 연결될 수 있음 (nullable)

---


# API 문서

<details>
<summary>Auth API</summary>

### 1. 회원가입

- **URL**: `POST /auth/signup`
- **필요 데이터 (Request Body)**:
```json
{
  "email": "string",
  "password": "string",
  "nickname": "string",
  "inviteCode": "string"
}
```
- **리턴값 (Response)**:
```json
{
  "message": "회원가입이 완료되었습니다.",
  "userId": "string"
}
```


---

### 2. 로그인

- **URL**: `POST /auth/signin`
- **필요 데이터 (Request Body)**:
```json
{
  "email": "string",
  "password": "string"
}
```
- **리턴값 (Response)**:
```json
{
  "accessToken": "string",
  "refreshToken": "string"
}
```

---

### 3. 로그아웃

- **URL**: `POST /auth/signout`
- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **리턴값 (Response)**:
```json
{
  "message": "로그아웃이 완료되었습니다."
}
```

---

### 4. 토큰 재발급

- **URL**: `POST /auth/refresh`
- **헤더**:
```
Authorization: Bearer <refreshToken>
```
- **리턴값 (Response)**:
```json
{
  "accessToken": "string"
}
```

---

## Roles API

### 5. 역할 초기화
- **URL**: `POST /roles/init`

- **리턴값 (Response)**:
```json
{
  "message": "역할이 초기화되었습니다."
}
```

---

### 6. 역할 변경

- **URL**: `PATCH /roles/manage`
- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **필요 데이터 (Request Body)**:
```json
{
  "userId": "string",
  "newRoleName": "string",
  "reason": "string"
}
```
- **리턴값 (Response)**:
```json
{
  "message": "역할이 성공적으로 변경되었습니다.",
}
```

---

### 7. 역할별 사용자 목록 조회

- **URL**: `GET /roles/users`
- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **쿼리 파라미터 (Query)**:
  - `role` (string, 필수)
  - `pageParam` (string, 선택)
- **리턴값 (Response)**:
```json
{
  "users": [
    {
      "userId": "string",
      "email": "string",
      "nickname": "string",
      "role": "string",
      "isMe": "boolean",
    }
  ],
  "nextPageParam": "string"
}
```

---

### 8. 역할 변경 로그 조회

- **URL**: `GET /roles/logs`
- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **쿼리 파라미터 (Query)**:
  - `from` (YYYY-MM-DD, 선택)
  - `to` (YYYY-MM-DD, 선택)
  - `pageParam` (string, 선택)
- **리턴값 (Response)**:
```json
{
  "logs": [
    {
      "timestamp": "string",
      "userId": "string",
      "oldRole": "string",
      "newRole": "string",
      "changedBy": "string",
      "reason": "string"
    }
  ],
  "nextPageParam": "string"
}
```

---

### 9. 유저 정보 조회

- **URL**: `GET /users/:email`

- **리턴값 (Response)**:
```json
{
    "id": "string",
    "email": "string",
    "nickname": "string",
    "inviteCode": "string",
}
```

</details>
<details>
<summary>Event API</summary>


### 1. 이벤트 생성 (POST `/events`)

- **헤더**:
```
Authorization: Bearer <accessToken>
```
* **바디 (JSON)**

```json
    {
        "title": "string",
        "description": "string",
        "conditionParams": { "type": "EventConditionType", "days": "number" },
        "startAt": "Date",
        "endAt": "Date"
    }
```
- **리턴값 (Response)**:
```json
{
  "message": "이벤트 등록 완료",
}
```
---

### 2. 이벤트 수정 (PUT `/events/:eventId`)

- **헤더**:
```
Authorization: Bearer <accessToken>
```
* **바디 (JSON)**

```javascript
{
    title?: string,
    description?: string,
    startAt?: string,
    endAt?: string,
    status?: EventStatus,
    conditionParams?: ConditionParamsDto,
}
```
- **리턴값 (Response)**:
```json
{
  "message": "이벤트가 성공적으로 수정되었습니다",
}
```

---
### 3. 이벤트 조회 (GET `/events`)

- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **쿼리 파라미터 (Query)**:
  - `pageParam` (number)
- **리턴값 (Response)**:
```javascript
{
    items: IResEvent[] = {
        id: string;
        title: string;
        description: string;
        status: EventStatus;
    };
    nextPage?: number;
}
```
---

### 4. 이벤트 상세조회 (GET `/events/:eventId`)

- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **쿼리 파라미터 (Query)**:
  - `eventId` (string)
- **리턴값 (Response)**:
```javascript
{
    id: string;
    title: string;
    description: string;
    conditionParams: {
        type: EventConditionType;
        days: number;
    };
    startAt: Date;
    endAt: Date;
    status: EventStatus;
}
```
---
### 5. 보상 추가 (POST `/rewards`)

- **헤더**:
```
Authorization: Bearer <accessToken>
```
- **Boby**:
```javascript
    CreateRewardDto {
        eventId: string;
        rewardType: RewardType;
        description?: string;
        amount: number;
    }
```
  
- **리턴값 (Response)**:
```javascript
{ message: '이벤트 보상 등록 완료' }
```
---
### 6. 보상 조회 (POST `/rewards`)

- **쿼리 파라미터 (Query)**:
  - `pageParam` (number)
- **리턴값 (Response)**:
```javascript
IResRewardList {
    items: IResReward[] = {
        id: string;
        rewardType: RewardType;
        description: string;
        amount: number;
        event: {
            id: string;
            title: string;
            status: EventStatus;
        };
        createdAt: Date;
        updatedAt: Date;
    };
    nextPage?: number;
}

```
---
### 7. 보상 수정 (PATCH `/rewards/update`)

* **헤더**
```
  * Authorization: Bearer 토큰 (JWT)
```
* **바디 (JSON)**

```javascript
{
    rewardId: string;
    rewardType?: RewardType;
    description?: string;
    amount?: number;
}
```
- **리턴값 (Response)**:
```javascript
{ message: '보상이 성공적으로 수정되었습니다.' }
```

---
### 8. 나의 보상 요청 내역조회 (GET `/rrewards/requests/me`)

* **헤더**
```
  * Authorization: Bearer 토큰 (JWT)
```
- **쿼리 파라미터 (Query)**:
  - `pageParam` (number)
```javascript

- **리턴값 (Response)**:
IResRewardRequestList {
    items: IResRewardRequest[] = {
           
        requestId: string;
        event: {
            eventId: string;
            title: string;
            status: EventStatus;
            description: string;
        };
        reason: RewardRequestReason;
        status: RewardRequestStatus;
    };
    nextPage?: number;
}
```
---
### 9. 보상 요청 내역조회 (GET `/rrewards/requests`)

* **헤더**
```
  * Authorization: Bearer 토큰 (JWT)
```
- **쿼리 파라미터 (Query)**:
    - 'pageParam': number,
    - 'satus?': RewardRequestStatus,
    - 'conditionType?': EventConditionType,
```javascript

- **리턴값 (Response)**:
IRewardRequestItemList {
    items: IRewardRequestItem[] = {
        {
            _id: string;
            userId: string;
            status: RewardRequestStatus;
            reason: RewardRequestReason;
            createdAt: string;
            event: {
                _id: string;
                title: string;
                conditionParams: {
                    type: EventConditionType;
                    days: number;
                };
            };
            user: {
                nickname: string;
            };
        }
    };
    nextPage?: number;
}
```
---

### 10. 보상 요청 (POST `/rrewards/requests/claim`)

* **헤더**
```
  * Authorization: Bearer 토큰 (JWT)
```
- **Body**:
```

RewardClaimDto {
    userId: string;
    eventId: string;
    status?: RewardRequestStatus;
    reason?: RewardRequestReason;
}
```

 **리턴값 (Response)**:
 ```
 {
    message: '요청이 성공적으로 등록되었습니다.' 
 }
```

</details>
