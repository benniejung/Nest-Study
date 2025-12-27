# 스터디 3회차 회고

의존성 주입(DI), NestJS 작동 흐름, ConfigModule, TypeOrmModule

## 1. 의존성 주입(DI) & IoC 컨테이너

### 의존성 주입(DI, Dependency Injection)

> 객체가 필요로 하는 의존성을 직접 생성하지 않고  
> **외부에서 주입받도록 하는 디자인 패턴**

---

### ❌ DI를 사용하지 않은 경우

```ts
class Robot {
  private tool = new Hammer();

  work() {
    this.tool.use();
  }
}
```

#### 문제점

- 로봇이 도구를 직접 생성함
- 도구가 바뀌면 로봇 코드 수정 필요
- 객체 간 결합도가 높음
- 테스트 및 확장 어려움

---

### ✅ DI를 사용한 경우

```ts
class Robot {
  constructor(private tool: Tool) {}

  work() {
    this.tool.use();
  }
}
```

#### 장점

- 로봇은 도구의 구체적인 구현을 모름
- 외부에서 어떤 도구를 쓸지 결정
- 결합도가 낮음
- 테스트와 확장이 쉬움

---

### 🔑 정리

- DI는 "의존성을 외부에서 주입받아 사용하는 방법"
- 객체는 자신의 역할에만 집중할 수 있음
- 코드 변경에 강해짐 (유연성 ↑)

---

## 2. IoC(Inversion of Control) 컨테이너

> 객체 생성과 의존성 관리의 주도권을  
> 개발자가 아닌 프레임워크가 가지는 설계 원칙

### IoC 컨테이너의 역할

- 객체 생성
- 객체 생명주기 관리
- 의존성 주입(DI) 수행

👉 NestJS에서는 Nest IoC 컨테이너가 이 역할을 담당

---

## 3. NestJS 애플리케이션 실행 흐름

```
시작
  ↓
main.ts 실행 → NestFactory.create()
  ↓
AppModule 로드 및 의존성 분석
  ↓
모든 모듈 초기화 (onModuleInit)
  ↓
애플리케이션 부트스트랩 완료 (onApplicationBootstrap)
  ↓
HTTP 서버 시작 및 요청 대기
  ↓
[요청 처리]
  ↓
요청 → Middleware → Guards → Interceptors → Pipes → Controller → Interceptors → Response
  ↓
[종료 시]
  ↓
onModuleDestroy → beforeApplicationShutdown → onApplicationShutdown
```

---

## 4. AppModule 관련 개념

### 4.1 ConfigModule & ConfigService

#### ConfigModule이란?

> 환경 변수(process.env)를 읽어  
> NestJS 애플리케이션 전반에서 설정값을 안전하게 관리하도록 도와주는 모듈

---

##### ❌ ConfigModule 없이 사용할 경우

```ts
process.env.DB_HOST;
process.env.DB_PASSWORD;
```

##### 문제점

- process.env를 여기저기 직접 사용
- 오타가 나도 런타임까지 모름
- 필수 환경 변수가 없어도 앱 실행됨
- 테스트가 어려움

---

##### ✅ ConfigModule 사용 시

```ts
constructor(private configService: ConfigService) {}

const dbHost = configService.get('DB_HOST');
```

##### 장점

- 설정값을 한 곳에서 관리
- 환경 변수 검증 가능
- 기본값 / 타입 설정 가능
- Nest의 DI 시스템과 자연스럽게 연동

---

##### ConfigModule이 하는 일

- `.env` 파일 로드
- 환경 변수를 process.env에 등록
- ConfigService 제공
- (선택) 환경 변수 검증 및 가공

---

##### ConfigModule 주요 옵션

###### cache

- process.env 값을 메모리에 캐싱

###### isGlobal

- 전역 모듈 등록
- 모든 모듈에서 ConfigService 사용 가능

###### envFilePath

- 로드할 .env 파일 경로 지정

###### validate

- 커스텀 검증 함수 작성

###### validationSchema

- Joi 스키마로 환경 변수 검증

###### load

- 커스텀 설정 파일 로드

###### expandVariables

- .env 파일 내 변수 참조 허용

---

##### ConfigService.get vs process.env

| 항목      | process.env | ConfigService.get |
| --------- | ----------- | ----------------- |
| 제공자    | Node.js     | NestJS            |
| 관리 위치 | 전역        | DI 컨테이너       |
| 검증      | ❌          | ⭕                |
| 테스트    | ❌          | ⭕                |
| 타입      | ❌          | ⭕                |
| 유지보수  | 나쁨        | 좋음              |

---

##### 비유로 이해하기

- **ConfigModule** = 도서관 시스템
  - 어떤 책(환경 변수)을 관리할지 결정

- **ConfigService** = 사서
  - 필요한 책(환경 변수)을 찾아서 제공

---

### 4.2 TypeOrmModule

#### TypeOrmModule이란?

> NestJS에서 TypeORM을  
> Nest의 DI 시스템과 연결해주는 공식 모듈

#### TypeORM이란?

> TypeScript / JavaScript 객체를  
> 데이터베이스 테이블과 매핑해주는 ORM 라이브러리

##### 핵심 개념

- SQL을 직접 많이 작성하지 않아도 됨
- 클래스와 객체 중심으로 DB 조작 가능
- Repository 패턴 기반

---

## 5. 요청(Request) 처리 흐름

<img width="1400" height="500" alt="image" src="https://github.com/user-attachments/assets/d6ae6b35-0a38-4250-976e-1a7bc848e04e" />

```
Request
  ↓
Middleware
  ↓
Guards (인증 / 인가)
  ↓
Interceptors (Before)
  ↓
Pipes (데이터 변환 / 검증)
  ↓
Controller Handler
  ↓
Interceptors (After)
  ↓
Exception Filters (에러 처리)
  ↓
Response
```

### 각 단계 역할 요약

#### Middleware

- 요청/응답 가로채기
- 로깅, CORS, 인증 전처리

#### Guards

- 접근 권한 검사 (인증/인가)

#### Interceptors

- 실행 전/후 로직
- 로깅, 응답 변환, 성능 측정

#### Pipes

- 데이터 검증 및 타입 변환
- ValidationPipe, ParseIntPipe 등

#### Exception Filters

- 예외 처리 및 에러 응답 포맷 통일

---

## 6. ValidationPipe (useGlobalPipes)

```ts
app.useGlobalPipes(
  new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }),
);
```

### 옵션 설명

#### whitelist

- DTO에 없는 속성 자동 제거

#### forbidNonWhitelisted

- DTO에 없는 속성이 있으면 에러 발생

#### transform

- 요청 데이터를 DTO 타입으로 자동 변환
- string → number / boolean 등 변환

### 참고 자료

- [NestJS 공식 문서 - Validation](https://docs.nestjs.com/techniques/validation)

---
