# MeetEase (마주침)

## 프로젝트 소개
`MeetEase`(마주침)는 사용자의 관심사, 성별, 나이대, 성격, 가능한 일정, 위치 정보 등을 토대로 근처에 있는 다른 사용자들과 그룹을 매칭해주는 웹 애플리케이션입니다. 본 프로젝트는 **프론트엔드**(React)와 **백엔드**(Flask + Firestore)를 결합하여, 원활한 온보딩 경험과 실시간 매칭 기능을 제공합니다.

---

## 주요 기능

1. **카카오톡 로그인**  
   - 카카오 SDK를 이용해 OAuth 로그인 처리  
   - Firebase Firestore에 사용자 문서 자동 생성  
   - 로그인 후 온보딩 플래그(`onboarded`) 로컬스토리지에 저장  

2. **온보딩(프로필 입력)**  
   - 단계별로 성별, 나이대, 관심사, 성격, 날짜·시간, 위치 정보를 입력  
   - `datetime-local` 입력을 통해 날짜와 시간을 함께 선택  
   - 현재 시점 이전의 일정 선택 시 경고 메시지 출력  
   - 도로명 주소를 입력받아 Kakao Local API로 위도/경도 변환  
   - 최종 입력 완료 시 Firestore에 프로필 정보 저장

3. **그룹 조회 및 매칭**  
   - `/api/groups` 엔드포인트로 생성된 그룹 목록 조회  
   - `/api/group/match` 엔드포인트로 현재 로그인한 사용자를 기준으로 그룹 매칭  
   - 매칭 기준: 공통 관심사, 공통 가능 일정, 반경 4km 이내 위치  
   - 그룹 인원 수에 따라 `confirmed` 또는 `candidate` 상태로 분류  

4. **지오위치 기반 매칭 강화**  
   - Haversine 공식을 이용해 두 지점 간의 직선 거리를 계산  
   - GeoHash/Geofirestore 연동(예정)으로 대규모 위치 기반 쿼리 최적화 가능성 확보

5. **UI/UX 및 스타일링**  
   - React + Tailwind CSS 스타일 적용  
   - 토스(Toss) 스타일 버튼 컴포넌트 제공  
   - Framer Motion으로 부드러운 화면 전환 및 애니메이션 구현

---

## 기술 스택

- **프론트엔드**: React, react-router-dom, axios, framer-motion, Tailwind CSS  
- **백엔드**: Python, Flask, flask-cors  
- **데이터베이스**: Firebase Firestore  
- **인증**: Kakao OAuth  
- **위치 API**: Kakao Local REST API

---

## 프로젝트 구조

```
src/
├── components/
│   ├── auth/
│   │   └── KakaoLoginButton.js    # 카카오 로그인 버튼
│   ├── onboarding/
│   │   ├── OnboardingController.js
│   │   └── steps/
│   │       └── FullOnboarding.js  # 단계별 온보딩 폼
│   └── MatchPage.js               # 매칭 및 그룹 조회 UI
├── pages/
│   ├── KakaoLoginPage.js          # 로그인 페이지 라우트
│   └── MatchPage.js               # 매칭 페이지 라우트
├── firebase.js                    # Firebase 초기화 설정
├── App.js                         # 라우팅 및 인증 플로우
└── index.js                       # 엔트리 포인트

backend/
└── MeetEase.py                    # Flask 서버 및 API 구현
```

---

## 실행 방법

1. **백엔드**
   ```bash
   cd backend
   pip install -r requirements.txt
   python MeetEase.py
   ```

2. **프론트엔드**
   ```bash
   cd src
   npm install
   npm start
   ```

3. **환경 변수 설정**
   - `REACT_APP_KAKAO_REST_API_KEY`: Kakao Local API REST 키  
   - `REACT_APP_API_BASE_URL`: 배포 환경의 API URL

---

## API 명세

- **GET** `/api/groups`  
  - 생성된 그룹 리스트 반환

- **POST** `/api/group/match`  
  - Request JSON: `{ "user_id": "user@example.com" }`  
  - Response JSON: 매칭된 그룹 정보 배열

---

## 앞으로의 개선 사항

- GeoHash/Geofirestore로 위치 기반 대규모 쿼리 최적화  
- 채팅, 실시간 알림 기능 추가  
- 다국어 지원 (i18n)  
- 모바일 반응형 최적화

---

**만든 이**: 마주침 개발팀

**라이선스**: MIT License

