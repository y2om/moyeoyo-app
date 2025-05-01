// src/pages/KakaoLoginPage.js
import React from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

const KakaoLoginPage = ({ onLogin }) => {
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("3272fe5644d61fd7ded031b2ff721155");
            console.log("✅ Kakao SDK Initialized");
        }
    }, []);

    const loginWithKakao = () => {
        window.Kakao.Auth.login({
            scope: "profile_nickname, account_email",
            success: async () => {
                try {
                    const res = await window.Kakao.API.request({ url: "/v2/user/me" });
                    const nickname = res.kakao_account.profile.nickname;
                    const email = res.kakao_account.email;

                    // Firestore에 사용자 문서 생성
                    await setDoc(doc(db, "users", email), {
                        nickname,
                        email,
                        createdAt: new Date(),
                    });

                    // 로컬스토리지에 onboarded=false 포함해서 저장
                    const user = { nickname, email, onboarded: false };
                    localStorage.setItem("user", JSON.stringify(user));
                    onLogin(user);

                    alert(`환영합니다, ${nickname}님! 프로필을 입력해주세요.`);
                    navigate("/onboarding");
                } catch (err) {
                    console.error("❌ 사용자 정보 요청 실패:", err);
                    alert("로그인 정보 처리에 실패했습니다.");
                }
            },
            fail: (err) => {
                console.error("❌ 카카오 로그인 실패:", err);
                alert("로그인에 실패했습니다.");
            },
        });
    };

    return (
        <div style={{ textAlign: "center", marginTop: 100 }}>
            <button
                onClick={loginWithKakao}
                style={{
                    backgroundColor: "#FEE500",
                    border: "none",
                    borderRadius: 8,
                    padding: "12px 24px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    fontSize: 16,
                }}
            >
                카카오톡으로 로그인
            </button>
        </div>
    );
};

export default KakaoLoginPage;
