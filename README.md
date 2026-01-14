## 📌NEXT.js, Supabase 기반 나만의 TODO-LIST

### 프로젝트 설명
이 프로젝트는 Supabase를 백엔드로 사용한 웹 애플리케이션입니다. 인증(Authentication), 데이터베이스(Database), 실시간 데이터 처리 CRUD(Create, Read, Update, Delete) 기능을 Supabase를 통해 구현하였으며, 프론트엔드는 React(NEXT.js) 환경에서 개발되었습니다. <br />

---

### 배포 주소

* Demo: (추후 배포 URL 추가)

---

### 개발 환경

1. SASS/SCSS 설치: `npm i sass` <br />

2. npx shadcn@latest init

3. Next.js Markdown Editor 설치: npm i @uiw/react-md-editor <br />

4. 서버리스 데이터베이스 Supabase 설치: npm i @supabase/supabase-js <br />

5. 고유한 키 값을 생성하기 위한 라이브러리: npm i nanoid <br />


---

### 기술 스택

#### Frontend

* React (Next js)
* JavaScript (ES6+, Typscript)
* SCSS, Tailwind
* 상태 관리: Jotai (프로젝트 사용 기준)

#### Backend 

* **Supabase**

  * PostgreSQL Database
  * Authentication
  * API (Auto-generated REST)

#### 기타

* Axios
* shadcn ui

---

### 주요 기능

*  CRUD 기능

  * 데이터 생성(Create)
  * 데이터 조회(Read)
  * 데이터 수정(Update)
  * 데이터 삭제(Delete)

*  Supabase 인증

  * 이메일 기반 로그인 / 회원가입
  * 인증 상태 유지

*  실시간 데이터 반영

  * Supabase Realtime 기능 활용

*  사용자 피드백

  * 성공 / 실패 시 Toast 알림 제공

---

### 핵심 구현 포인트

#### Supabase 연동

* Supabase Client를 별도 유틸 파일로 분리하여 재사용성 강화
* API 호출 시 에러 핸들링 및 상태 관리 분리

#### 상태 관리

* 전역 상태(atom)를 활용해 데이터 공유
* 서버 데이터 변경 시 즉시 UI 반영

#### 사용자 경험 개선

* 로딩 상태 처리
* 에러 상황에 대한 명확한 피드백 제공
* 로그인 후, 쿠키에 담긴 user 데이터를 기준으로 middleware.ts 파일에서 페이지 리다이렉션 관리