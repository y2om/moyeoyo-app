import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import KakaoLoginButton from "./components/auth/KakaoLoginButton";
import UserOnboarding from "./components/onboarding/UserOnboarding";
import MatchPage from "./pages/MatchPage"; // 매칭 페이지

function App() {
    const [onboardingComplete, setOnboardingComplete] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const logoutFromKakao = () => {
        const kakao = window.Kakao;

        if (kakao?.Auth?.getAccessToken()) {
            kakao.Auth.logout(() => {
                console.log("🧼 로그아웃 완료");
                localStorage.removeItem("user");
                window.location.reload();
            });
        } else {
            localStorage.removeItem("user");
            window.location.reload();
        }
    };

    if (!user) {
        return (
            <div
                style={{
                    backgroundImage: "url('/background.jpg')",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <div
                    style={{
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        padding: "40px",
                        borderRadius: "12px",
                        textAlign: "center",
                    }}
                >
                    <h1 style={{ fontSize: "2.5rem", color: "#fff" }}>마주침</h1>
                    <KakaoLoginButton />
                </div>
            </div>
        );
    }

    return (
        <Router>
            <div style={{ fontFamily: "Noto Sans KR, sans-serif", padding: "2rem", minHeight: "100vh" }}>
                <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                    <button onClick={logoutFromKakao}>로그아웃</button>
                </div>

                <Routes>
                    {/* 메인 경로: 온보딩 여부에 따라 이동 */}
                    <Route
                        path="/"
                        element={
                            onboardingComplete ? (
                                <Navigate to="/match" replace />
                            ) : (
                                <UserOnboarding user={user} onComplete={() => setOnboardingComplete(true)} />
                            )
                        }
                    />

                    {/* 매칭 결과 페이지 */}
                    <Route path="/match" element={<MatchPage />} />

                    {/* 잘못된 경로 접근 시 홈으로 */}
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
