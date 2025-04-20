import React, { useState } from "react";
import KakaoLoginButton from "./KakaoLoginButton";
import UserPreferenceForm from "./UserPreferenceForm";
import AdminPage from "./AdminPage";
import { setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

function App() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [view, setView] = useState("main"); // 'main' | 'admin'

    const handlePreferenceSave = async (data) => {
        try {
            await setDoc(doc(db, "users", user.email), {
                ...user,
                ...data,
                updatedAt: new Date(),
            });
            alert("✅ 관심사 및 시간이 저장되었습니다!");
        } catch (error) {
            console.error("❌ Firestore 저장 실패", error);
        }
    };

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
        );
    }

    return (
        <div style={{ fontFamily: "Noto Sans KR, sans-serif", position: "relative", minHeight: "100vh", padding: "2rem" }}>
            {/* 오른쪽 상단 버튼 */}
            <div style={{ position: "absolute", top: "20px", right: "20px", display: "flex", gap: "10px" }}>
                {user.email === "ybhss1418@naver.com" && (
                    <>
                        <button
                            onClick={() => setView("main")}
                            style={{
                                backgroundColor: "#007bff",
                                color: "#fff",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            사용자 화면
                        </button>
                        <button
                            onClick={() => setView("admin")}
                            style={{
                                backgroundColor: "#6c757d",
                                color: "#fff",
                                border: "none",
                                padding: "8px 12px",
                                borderRadius: "6px",
                                cursor: "pointer",
                            }}
                        >
                            관리자 페이지
                        </button>
                    </>
                )}
                <button
                    onClick={logoutFromKakao}
                    style={{
                        backgroundColor: "#ddd",
                        border: "none",
                        padding: "8px 16px",
                        borderRadius: "6px",
                        fontSize: "14px",
                        cursor: "pointer",
                    }}
                >
                    로그아웃
                </button>
            </div>

            {/* 본문 */}
            {view === "admin" && user.email === "ybhss1418@naver.com" ? (
                <AdminPage />
            ) : (
                <>
                    <h1>모여요 - 청년 교류 매칭 서비스</h1>
                    <h2>{user.nickname}님 안녕하세요 👋</h2>
                    <p>{user.email}</p>
                    <UserPreferenceForm onSave={handlePreferenceSave} />
                </>
            )}
        </div>
    );
}

export default App;
