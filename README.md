# 마주침(MeetEase)

서울시 청년 1인 가구를 위한 공공 공간 기반 교류 플랫폼입니다. 관심사, 가능 시간, 위치 정보를 입력하면 자동 매칭되어 그룹 활동을 유도합니다.

---

## 💡 프로젝트 개요

**마주침(MeetEase)**은 서울시 1인 가구 청년들이 공통 관심사 및 참여 가능 시간에 맞춰 자연스럽게 교류할 수 있도록 돕는 서비스입니다. 사용자가 관심사와 가능 시간을 입력하면, 자동으로 유사한 조건의 사용자들과 매칭되어 소규모 그룹이 형성되고, 문화행사 정보를 추천받을 수 있습니다.

---

## ⚙️ 주요 기능

### ✅ 사용자 정보 입력
- 관심사, 나이대, 가능한 날짜 및 시간, 위치 정보 입력
- Firebase Firestore에 사용자 정보 저장

### 🔄 자동 그룹 매칭
- Flask 백엔드 서버에서 `/api/group/match` 엔드포인트로 매칭 요청
- Firestore에서 사용자 데이터 가져옴
- 공통 관심사, 공통 날짜, 최대 4km 이내 거리 조건이 모두 만족되는 사용자들을 매칭
- 매칭 결과를 Firestore의 `groups` 컬렉션에 저장

### 🔍 그룹 조회
- `/api/groups` 엔드포인트를 통해 매칭된 그룹 정보 조회
- 프론트엔드에서 Axios로 불러와 매칭 결과 화면에 표시

---

## 🛠️ 기술 스택

| 영역       | 사용 기술                            |
|------------|--------------------------------------|
| 프론트엔드 | React (Vite), Axios, Vercel 배포     |
| 백엔드     | Flask, Firebase Admin SDK, Ngrok     |
| 데이터베이스 | Firebase Firestore                   |
| 기타       | Flask-CORS, REST API 구조, Haversine 거리 계산 |

---

## 🚀 실행 및 배포

### 1. 백엔드 (Flask 서버) 실행

```bash
python MeetEase.py
```

> `firebase_key.json` 위치를 정확하게 설정하세요.  
> Ngrok으로 외부 접근을 위해 포트를 노출합니다:

```bash
ngrok http 5000
```

Ngrok 주소를 확인하여 `BASE_URL`로 사용합니다 (예: `https://xxxx.ngrok-free.app`)

### 2. 프론트엔드 실행

```bash
npm run dev
```

> 개발용: `http://localhost:3000`  
> 배포용: Vercel (`https://moyeoyo-app.vercel.app`)

**주의**
- Vercel에서 백엔드 API 호출 시 `CORS` 문제를 방지하기 위해 Flask에 `CORS(app)`를 반드시 설정해야 합니다.
- Firestore 및 Ngrok 주소는 항상 최신 상태로 반영되어야 정상 작동합니다.

---

## 📁 API 엔드포인트 요약

| 메서드 | 경로                  | 설명                         |
|--------|-----------------------|------------------------------|
| POST   | `/api/group/match`    | 사용자 기반 자동 그룹 매칭 수행 |
| GET    | `/api/groups`         | Firestore에 저장된 그룹 정보 조회 |

---

🕒 마지막 수정: 2025-05-01