## 안내 (제출 기한 지나고 수정한 내용입니다.)

본 프로젝트는 제출 기한 내 주요 기능은 구현 완료했으나, Docker 환경 구성에 일부 미흡한 점이 있었습니다. 이후 지속적으로 개선하여 현재는 Docker 기반 실행이 가능하도록 보완하였습니다. 아래의 실행 방법을 참고해 주세요.

## 실행 방법

1. 레포지토리 클론 및 이동

    ```code
    git clone https://github.com/ktkdgh-projects/maplestory-pc-backend.git
    ```

    ```code
    cd maplestory-pc-backend
    ```

2. 패키지 설치
    ```code
    yarn install
    ```
3. 전체 패키지 빌드

    ```code
    yarn build:all
    ```

4. .env 파일은 프로젝트 루트 경로에 생성해주시면 됩니다. (예: /maplestory-pc-backend/.env)

      ```code
      # MongoDB 연결 URI 예시
      MONGODB_URI="mongodb://admin:1234@mongodb1:27017,mongodb2:27017,mongodb3:27017/?authSource=admin&replicaSet=myRepl"

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
      AUTH_SERVER_URL="http://auth_server:3001/api"
      EVENT_SERVER_URL="http://event_server:3002/api"

      ```
5. 도커 실행 스크립트 
    ```code
    yarn init:docker
    ```
6. 역할 초기화 API 호출
    ```http
    POST http://localhost:3000/api/roles/init 
    ```

    - 이후 회원가입을 진행해주세요.


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

## 프로젝트 구조 및 모노레포 구성 이유
본 프로젝트는 모노레포(monorepo) 방식으로 구성되어 있습니다.
여러 서비스를 하나의 저장소에서 관리함으로써 다음과 같은 이점을 얻을 수 있었습니다:

- 공통 설정 및 환경 변수 관리를 통합적으로 처리할 수 있어 유지보수가 용이함

- Docker 환경에서의 실행 및 테스트 자동화가 간편해짐

이러한 이유로, 각 서비스를 독립적으로 개발하면서도 통합적인 관리가 가능하도록 모노레포 방식을 선택하게 되었습니다.
## 마무리

이번 프로젝트는 인증(Auth), 이벤트(Event), API 게이트웨이(Gateway) 등 각 기능을 독립적인 서비스로 구성하며, 마이크로서비스 아키텍처의 흐름을 직접 설계하고 경험해볼 수 있는 좋은 기회였습니다.

초기에는 Docker 환경 설정 및 서비스 간 통신 구조에서 어려움이 있었지만, 다양한 시도와 학습을 통해 점차 구조를 개선하고 안정화시킬 수 있었습니다. 실무와 유사한 환경에서 서비스 간 역할 분리, 배포 및 실행 방식을 고민하고 구현한 과정이 매우 의미 있었습니다.