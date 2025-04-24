import React, { useState } from "react";
import KakaoLoginButton from "./components/auth/KakaoLoginButton";
import UserOnboarding from "./components/onboarding/UserOnboarding";
import EventRecommendation from "./components/event/EventRecommendation";

function App() {
    const [filteredInfo, setFilteredInfo] = useState(null);
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
        <div style={{ fontFamily: "Noto Sans KR, sans-serif", padding: "2rem", minHeight: "100vh" }}>
            <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                <button onClick={logoutFromKakao}>로그아웃</button>
            </div>

            {filteredInfo ? (
                <EventRecommendation
                    interests={filteredInfo.interests}
                    selectedDate={filteredInfo.availableTimes?.[0]?.date}
                    selectedGu={filteredInfo.location}
                />
            ) : (
                <UserOnboarding user={user} onComplete={setFilteredInfo} />
            )}
        </div>
    );
}

export default App;
