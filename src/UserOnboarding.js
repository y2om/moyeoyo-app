import React, { useState } from "react";
import KakaoLoginButton from "./KakaoLoginButton";
import UserOnboarding from "./UserOnboarding";
import AdminPage from "./AdminPage";
import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
    const [showAdminPage, setShowAdminPage] = useState(false);
    const user = JSON.parse(localStorage.getItem("user"));

    const logoutFromKakao = () => {
        if (window.Kakao && window.Kakao.Auth && window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log("🧼 로그아웃 완료");
                localStorage.removeItem("user");
                window.location.reload();
            });
        } else {
            localStorage.removeItem("user");
            window.location.reload();
        }
    };

    return (
        <div style={{ fontFamily: "Noto Sans KR, sans-serif", position: "relative", minHeight: "100vh" }}>
            {!user ? (
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
                        <h1
                            style={{
                                fontSize: "2.5rem",
                                color: "#fff",
                                marginBottom: "20px",
                                textShadow: "2px 2px 6px rgba(0,0,0,0.6)",
                            }}
                        >
                            모여요
                        </h1>
                        <KakaoLoginButton />
                    </div>
                </div>
            ) : showAdminPage ? (
                <AdminPage />
            ) : (
                <div style={{ padding: "2rem" }}>
                    <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                        <button
                            onClick={logoutFromKakao}
                            style={{
                                backgroundColor: "#ddd",
                                border: "none",
                                padding: "8px 16px",
                                borderRadius: "6px",
                                fontSize: "14px",
                                cursor: "pointer",
                                marginLeft: "10px",
                            }}
                        >
                            로그아웃
                        </button>
                        {user.email === "ybhss1418@naver.com" && (
                            <button
                                onClick={() => setShowAdminPage(true)}
                                style={{
                                    backgroundColor: "#007bff",
                                    color: "white",
                                    padding: "8px 16px",
                                    border: "none",
                                    borderRadius: "6px",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                }}
                            >
                                관리자 페이지
                            </button>
                        )}
                    </div>

                    <UserOnboarding user={user} />
                </div>
            )}
        </div>
    );
}

export default App;
