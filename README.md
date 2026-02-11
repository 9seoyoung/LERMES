# LERMES
LERMES는 LMS 템플릿을 제공하고, 랜딩페이지에서 홍보 + 소속 신청 기능을 포함한 멀티테넌트 서비스 입니다. 자체 구축과 운영이 어려운 중소규모 교육기관을 대상으로 제작했습니다.

## 기술 스택

- **Frontend**
  - React (CRA), JSX
  - Context API, React Router
 
- **Backend**
  - Java 21, Spring Boot 3.5
  - Spring Security, Spring Data JPA, MyBatis
  - MySQL, HikariCP, P6Spy 

- **Build & 기타**
  - Gradle 8.x
  - JWT / OAuth2 (Google, Kakao, Naver)
  - Git, GitLab CI

---

## 실행 방법

### 1) 환경 변수 설정

루트 디렉토리에서:

cp .env.example .env 또는 .env.example 파일을 복사하여 .env파일로 이름변경 후 
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
