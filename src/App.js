import React, { useState } from "react";
import KakaoLoginButton from "./KakaoLoginButton";
import UserOnboarding from "./UserOnboarding";
import AdminPage from "./AdminPage";
import TestSeoulEventAPI from "./TestSeoulEventAPI";

function App() {
    const [showAdminPage, setShowAdminPage] = useState(false);
    const [filteredInfo, setFilteredInfo] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    // ✅ Kakao 초기화 및 오류 방지 처리 포함
    const logoutFromKakao = () => {
        const kakao = window.Kakao;

        if (kakao && kakao.Auth && kakao.Auth.getAccessToken()) {
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
                    <h1 style={{ fontSize: "2.5rem", color: "#fff" }}>모여요</h1>
                    <KakaoLoginButton />
                </div>
            </div>
        );
    }

    const isAdmin = user.email === "ybhss1418@naver.com";

    return (
        <div style={{ fontFamily: "Noto Sans KR, sans-serif", padding: "2rem", minHeight: "100vh" }}>
            <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "10px" }}>
                <button onClick={logoutFromKakao}>로그아웃</button>
                {isAdmin && (
                    <button onClick={() => setShowAdminPage(!showAdminPage)}>
                        {showAdminPage ? "사용자 화면" : "관리자 페이지"}
                    </button>
                )}
            </div>

            {filteredInfo ? (
                <TestSeoulEventAPI
                    interests={filteredInfo.interests}
                    selectedDate={filteredInfo.availableTimes?.[0]?.date}
                    selectedGu={filteredInfo.location}
                />
            ) : showAdminPage && isAdmin ? (
                <AdminPage user={user} />
            ) : (
                <UserOnboarding user={user} onComplete={setFilteredInfo} />
            )}
        </div>
    );
}

export default App;
