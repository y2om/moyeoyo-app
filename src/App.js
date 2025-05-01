// src/App.js
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import KakaoLoginPage from "./pages/KakaoLoginPage";
import OnboardingController from "./components/onboarding/OnboardingController";
import MatchPage from "./pages/MatchPage";

export default function App() {
    const [user, setUser] = useState(null);

    // 앱 시작 시 로컬스토리지에서 유저 정보 읽어오기
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                setUser(null);
            }
        }
    }, []);

    return (
        <BrowserRouter>
            <Routes>
                {/* 1) 로그인 전 화면 */}
                <Route
                    path="/login"
                    element={<KakaoLoginPage onLogin={setUser} />}
                />

                {/* 2) 온보딩 페이지 */}
                <Route
                    path="/onboarding"
                    element={
                        user
                            ? user.onboarded
                                ? <Navigate to="/match" replace />
                                : <OnboardingController
                                    user={user}
                                    onComplete={() => {
                                        // 온보딩 완료 플래그 업데이트
                                        const updated = { ...user, onboarded: true };
                                        localStorage.setItem("user", JSON.stringify(updated));
                                        setUser(updated);
                                    }}
                                />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* 3) 매칭 페이지 */}
                <Route
                    path="/match"
                    element={
                        user
                            ? user.onboarded
                                ? <MatchPage />
                                : <Navigate to="/onboarding" replace />
                            : <Navigate to="/login" replace />
                    }
                />

                {/* 4) 기본 경로: 로그인/온보딩/매칭으로 분기 */}
                <Route
                    path="/"
                    element={
                        user
                            ? user.onboarded
                                ? <Navigate to="/match" replace />
                                : <Navigate to="/onboarding" replace />
                            : <Navigate to="/login" replace />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}
