# NestJS Study Project

NestJS 학습을 위한 프로젝트입니다.

## 🛠 기술 스택

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Container**: Docker & Docker Compose

## 📁 프로젝트 구조

```
nest-study/
├── src/
│   ├── app.controller.ts      # 메인 컨트롤러
│   ├── app.service.ts         # 메인 서비스
│   ├── app.module.ts          # 메인 모듈
│   └── main.ts                # 애플리케이션 진입점
├── test/                      # E2E 테스트
├── docker-compose.yml         # Docker Compose 설정
├── package.json
└── README.md
```

## 🚀 시작하기

### 사전 요구사항

- Node.js (v18 이상 권장)
- npm 또는 yarn
- Docker & Docker Compose

### 설치

1. 저장소 클론

```bash
git clone <repository-url>
cd nest-study
```

2. 의존성 설치

```bash
npm install
```

3. 환경 변수 설정
   `.env` 파일을 생성하고 필요한 환경 변수를 설정하세요. (자세한 내용은 아래 참조)

4. 데이터베이스 실행

```bash
docker-compose up -d
```

5. 애플리케이션 실행

```bash
# 개발 모드
npm run start:dev

# 프로덕션 모드
npm run build
npm run start:prod
```

애플리케이션은 기본적으로 `http://localhost:3000`에서 실행됩니다.

## 🔧 환경 변수 설정

프로젝트 루트에 `.env` 파일을 생성하고 다음 변수들을 설정하세요:

```env
# 서버 설정
PORT=3000

# MySQL 데이터베이스 설정
MYSQLDB_HOST=localhost
MYSQLDB_LOCAL_PORT=3306
MYSQLDB_USER=root
MYSQLDB_PASSWORD=1234
MYSQLDB_DATABASE=nest_study
```

## 🗄 데이터베이스 설정

### Docker Compose를 사용한 MySQL 실행

프로젝트에는 `docker-compose.yml` 파일이 포함되어 있어 MySQL을 쉽게 실행할 수 있습니다:

```bash
# MySQL 컨테이너 시작
docker-compose up -d

# MySQL 컨테이너 중지
docker-compose down

# MySQL 컨테이너 중지 및 볼륨 삭제
docker-compose down -v
```

Docker Compose 설정:

- **이미지**: mysql:8.0
- **포트**: 3306
- **데이터베이스**: nest_study
- **루트 비밀번호**: 1234
- **데이터 볼륨**: `./mysql_data`

## 📜 스크립트

```bash
# 개발 모드로 실행 (핫 리로드)
npm run start:dev

# 프로덕션 빌드
npm run build

# 프로덕션 모드로 실행
npm run start:prod

# 디버그 모드로 실행
npm run start:debug

# 코드 포맷팅
npm run format

# 린트 검사 및 자동 수정
npm run lint

# 단위 테스트
npm run test

# 테스트 커버리지
npm run test:cov

# E2E 테스트
npm run test:e2e
```

## 📝 추가 정보

### TypeORM 설정

TypeORM은 `app.module.ts`에서 설정됩니다. 환경 변수를 통해 데이터베이스 연결 정보를 관리합니다.

### 개발 팁

- 개발 중에는 `npm run start:dev`를 사용하여 코드 변경 시 자동으로 재시작됩니다.
- TypeORM의 마이그레이션 기능을 활용하여 데이터베이스 스키마를 관리할 수 있습니다.
- `.env` 파일은 버전 관리에 포함하지 마세요. `.gitignore`에 이미 추가되어 있습니다.

## 📄 라이선스

이 프로젝트는 학습 목적으로 만들어졌습니다.
