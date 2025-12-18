## NestJS Study Project

NestJS 학습을 위한 프로젝트입니다.

이 레포지토리는 실무 백엔드 역량 강화를 목표로 한 NestJS 스터디 기록용 저장소입니다.

🗓 주차별 학습 기록

각 주차별로 개념 정리 + 개인 회고를 Notion에 정리했습니다.

| 주차  | 학습 주제                | 내가 한 내용                                  | 노션 링크        |
| --- | -------------------- | ---------------------------------------- | ------------ |
| 1주차 | NestJS 개요 & 아키텍처     | Nest 철학, Module/Controller/Service 구조 정리 | 🔗 Notion 링크 |
| 2주차 |   |  | 🔗 Notion 링크 |
| 3주차 |    |  | 🔗 Notion 링크 |
| 4주차 |   |  | 🔗 Notion 링크 |
| 5주차 |    |  | 🔗 Notion 링크 |




## 🛠 기술 스택

- **Framework**: NestJS 11.x
- **Language**: TypeScript
- **Database**: MySQL 8.0
- **ORM**: TypeORM
- **Container**: Docker & Docker Compose


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
