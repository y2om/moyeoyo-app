import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";
import styles from "./KakaoLoginPage.module.css";

export default function KakaoLoginPage({ onLogin }) {
    const navigate = useNavigate();

    useEffect(() => {
        if (window.Kakao && !window.Kakao.isInitialized()) {
            window.Kakao.init("3272fe5644d61fd7ded031b2ff721155");
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

                    await setDoc(doc(db, "users", email), {
                        nickname,
                        email,
                        createdAt: new Date(),
                    });

                    const user = { nickname, email, onboarded: false };
                    localStorage.setItem("user", JSON.stringify(user));
                    onLogin(user);
                    navigate("/onboarding");
                } catch {
                    alert("로그인 처리 중 오류가 발생했습니다.");
                }
            },
            fail: () => {
                alert("로그인에 실패했습니다. 다시 시도해주세요.");
            },
        });
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.card}>
                <h1 className={styles.logo}>마주침</h1>
                <p className={styles.tagline}>새로운 만남, 편안한 시작</p>
                <button onClick={loginWithKakao} className={styles.kakaoButton}>
                    카카오톡으로 시작하기
                </button>
            </div>
        </div>
    );
}
