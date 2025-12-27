# 스터디 4회차 회고

Docker 기초, Docker Compose, Swagger 설정방법

## Docker란?

<div style="display: flex; gap: 30px; flex-wrap: wrap;">
  <img width="450" height="397" alt="image" src="https://github.com/user-attachments/assets/9ef2f6f0-acd7-4389-b504-6dcfb54cb101" />
  <img width="500" height="511" alt="image" src="https://github.com/user-attachments/assets/0976ccbc-4e0a-43b4-b591-feea7081b41e" />
</div>

> Docker는 애플리케이션과 그 실행 환경을 묶어  
> 하나의 OS 위에서 독립적으로 실행하게 해주는 컨테이너 기술

Docker를 사용하면

**다른 팀원이든, 다른 서버든 상관없이 동일한 환경에서 애플리케이션을 실행**할 수 있다.

---

### Docker의 기본 구조

```
OS
 └─ Docker Engine (1개)
     ├─ 컨테이너 A (Nest.js)
     ├─ 컨테이너 B (Spring)
     ├─ 컨테이너 C (DB)
```

- 하나의 OS 위에서 Docker Engine이 실행됨
- Docker Engine 위에 **여러 개의 컨테이너가 독립적으로 동작**
- 주로 **서버·백엔드 애플리케이션**에 사용
  - (React, Safari 같은 데스크톱 GUI 앱 ❌)

---

## Image와 Container

### Image란?

- **읽기 전용 템플릿**
- 애플리케이션 실행에 필요한 요소를 모두 포함
  - 애플리케이션 코드
  - 라이브러리
  - 실행 명령
- `Dockerfile`을 기반으로 생성됨

### Container란?

- Image로부터 생성됨
- **실제로 실행 중인 프로세스**
- 실행 중인 상태를 가짐
  - 메모리
  - 파일 변경
  - 네트워크 상태 등

---

## 비유로 이해하기

- **Image**
  → 클래스(Class) / 붕어빵 틀

- **Container**
  → 객체(Instance) / 실제 붕어빵

> 하나의 이미지로 여러 개의 컨테이너를 실행할 수 있다.

---

## Docker 실행 방법 (Docker Desktop 기준)

<img width="1500" height="600" alt="image" src="https://github.com/user-attachments/assets/298013cf-71c6-481f-a5e6-80479a619e78" />

### 1️⃣ 사용할 이미지 선택

- 좌측 메뉴에서 **Images** 탭으로 이동한다.
- 로컬에 이미 내려받은 이미지(Local) 또는 Docker Hub 이미지를 선택한다.
  - 예: `mysql:8.0`, `node:20`, `nginx:latest`

### 2️⃣ Image로 컨테이너 실행 시작

- 선택한 이미지의 **Run 버튼**을 클릭한다.

### 3️⃣ 컨테이너 실행 옵션 설정

#### Container name

- 컨테이너 식별용 이름 (선택)

#### Ports

- Host Port ↔ Container Port 매핑

  예: `3306 : 3306`
  - **왼쪽 3306 (Host Port)**
    - 내 로컬 OS의 포트
    - `localhost:3306`
    - MySQL Workbench, NestJS, DBeaver 등이 접속
  - **오른쪽 3306 (Container Port)**
    - 컨테이너 내부에서 MySQL이 실제로 사용하는 포트

#### Volumes (선택)

- 컨테이너 삭제·재시작과 무관하게
- **데이터를 유지하기 위한 영속 저장소**

#### Environment variables

- 컨테이너 실행에 필요한 환경 변수 설정
  (예: DB 비밀번호, 실행 모드 등)
- 예:
  - `MYSQL_ROOT_PASSWORD`
    - MySQL 공식 이미지에서 **미리 정해둔 환경변수 이름**
    - 다른 이름을 사용하면 초기화 실패

### 4️⃣ 컨테이너 실행

- 설정을 완료한 후 **Run 버튼**을 클릭한다.
- Docker Image를 기반으로 **컨테이너가 생성 및 실행**

---

## Docker Compose

<img width="623" height="262" alt="image" src="https://github.com/user-attachments/assets/be5518c7-8a42-4854-9c2c-01b19ad0db9c" />

> 여러 개의 Docker 컨테이너를 하나의 설정 파일로 함께 정의하고 실행하는 도구

실제 서비스는 보통 하나의 컨테이너로 끝나지 않는다.

예:

- NestJS 서버
- MySQL
- Redis

이를 **한 번에 실행**하기 위해 Docker Compose를 사용한다.

```
docker-compose.yml
 ├─ app (NestJS)
 ├─ db (MySQL)
 └─ cache (Redis)
        ↓
docker-compose up
        ↓
여러 컨테이너가 한 번에 실행
```

---

## Swagger 설정

> API 문서를 자동으로 생성하고 테스트할 수 있게 해주는 도구

### 1. 패키지 설치

```bash
npm install @nestjs/swagger swagger-ui-express
```

---

### 2. main.ts에서 Swagger 설정

```ts
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger 설정
  const config = new DocumentBuilder()
    .setTitle('NestJS Study API')
    .setDescription('NestJS Study API documentation')
    .setVersion('1.0')
    .addServer('http://localhost:1027', 'Local Environment')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(1027);
}
```

#### 설정 옵션 설명

- **setTitle**: API 문서의 제목
- **setDescription**: API 문서의 설명
- **setVersion**: API 버전
- **addServer**: 서버 URL과 설명 추가
- **setup**: Swagger UI가 접근할 경로 설정 (예: `/api-docs`)

---

### 3. DTO에 Swagger 데코레이터 추가

```ts
import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: '사용자 이름',
    example: 'testuser',
  })
  @IsString()
  @IsNotEmpty()
  username: string;

  @ApiProperty({
    description: '이메일',
    example: 'test@example.com',
  })
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: '프로필 이미지 URL',
    example: 'https://example.com/image.jpg',
    required: false, // 선택적 필드
  })
  profileImage?: string;
}
```

#### @ApiProperty 옵션

- **description**: 필드에 대한 설명
- **example**: 예시 값
- **required**: 필수 여부 (기본값: true)
- **default**: 기본값

---

### 4. Swagger UI 접근

애플리케이션 실행 후 브라우저에서 접근:

```
http://localhost:1027/api-docs
```

---
