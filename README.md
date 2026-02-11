# LERMES
LERMES는 **멀티테넌트 기반 LMS SaaS 플랫폼**입니다.

교육기관이 별도의 개발 없이 LMS를 생성하고,
랜딩페이지를 통해 홍보 및 소속 신청을 받을 수 있도록 설계했습니다.

중소 규모 교육기관을 대상으로,
LMS 생성 → 구성원 관리 → 과정 운영 → 승인 기반 소속 변경
흐름을 하나의 서비스로 통합했습니다.

## 프로젝트 개요

| 항목 | 내용 |
|------|------|
| 개발 기간 | 25.09.02 - 25.10.15 (약 7주) |
| 개발 인원 | 총 6명 (Frontend 2 / Full-Stack 1 / Backend 3) |
| 담당 역할 | PM 및 Frontend 개발 (일정 관리, 화면 및 구조 설계, 핵심 기능 구현) |
## 기술 스택

| 영역 | 기술 |
|------|------|
| Frontend | React (CRA), Context API, React Router |
| Backend | Java 21, Spring Boot 3.5 |
| Security | Spring Security, JWT, OAuth2 |
| Persistence | JPA, MyBatis, MySQL, HikariCP |
| Logging | P6Spy |
| Build | Gradle 8.x |
| DevOps | Git, GitLab CI |
 
---
## 주요 기능
> 현재 소속이 있는 계정은 다른 소속에 가입 할 수 없습니다.
> 등록된 과정에 신청했을 경우 최종 승인되어야 현재 소속으로 변경됩니다.
- **LMS 생성** ( = 테넌트 계정, 비즈니스/제휴 메뉴 > 비즈니스 가입 )
- **직원/강사 등록** ( = 일반 계정, 랜딩페이지 > LMS 바로가기 > 직원신청 or 강사신청 / 테넌트 계정 ( LMS > 계정관리 > 승인 / 거절)
- **과정 등록** (과정 등록시 교육정보 + 모집설문을 등록하면 랜딩페이지에 노출 > 일반 계정 사용자의 신청을 받을 수 있습니다.)
- **설문 폼 빌더**
- **캘린더 일정 플로팅**

---
## 실행 방법

### 1) 환경 변수 설정

루트 디렉토리에서:
```bash
cp .env.example .env
```
.env 파일을 열어서 실제 값을 채웁니다.
#### 환경 변수
| KEY | 설명 |
|-----|------|
| DB_HOST | DB 서버 주소 |
| DB_PORT | DB 포트 번호 |
| DB_NAME | 데이터베이스 이름 |
| DB_USERNAME | DB 사용자명 |
| DB_PASSWORD | DB 비밀번호 |
| MAIL_USERNAME | SMTP 계정 이메일 |
| MAIL_PASSWORD | SMTP 앱 비밀번호 |
| GOOGLE_CLIENT_ID | Google OAuth Client ID |
| GOOGLE_CLIENT_SECRET | Google OAuth Client Secret |
| KAKAO_CLIENT_ID | Kakao REST API 키 |
| KAKAO_CLIENT_SECRET | Kakao Client Secret |
| NAVER_CLIENT_ID | Naver Client ID |
| NAVER_CLIENT_SECRET | Naver Client Secret |

> .env 파일은 .gitignore에 포함되어 있어 Git에 커밋되지 않습니다.

### 2) 백엔드 실행
프로젝트 루트 디렉토리에서 ./gradlew 를 실행시킵니다.
```./gradlew bootRun```

### 3) 프론트 실행
프론트엔드 디렉토리로 이동 > 의존성 설치 > 실행 단계를 따릅니다.
```
cd src/main/frontend
npm install
npm start
```

---
### 브랜치
- DEV : "부트캠프 프로젝트 기간 내 프로젝트" v1.0.0
- DEV-hotfix: DEV 오류 수정 v1.0.1
- syPersonal: 라우팅 구조 및 화면 구성 변경 중인 리팩토링 브랜치 v2
