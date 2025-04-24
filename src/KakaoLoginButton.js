<<<<<<< HEAD
﻿import React, { useEffect } from "react";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

const KakaoLoginButton = () => {
    // ✅ Kakao SDK 초기화
    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("3272fe5644d61fd7ded031b2ff721155"); // 💡 .env 사용 권장
=======
﻿import { useEffect } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const KakaoLoginButton = () => {
    useEffect(() => {
        if (!window.Kakao.isInitialized()) {
            window.Kakao.init("3272fe5644d61fd7ded031b2ff721155"); // 본인의 JavaScript 키 입력
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
            console.log("✅ Kakao SDK Initialized");
        }
    }, []);

<<<<<<< HEAD
    // ✅ 카카오 로그인 처리
    const loginWithKakao = async () => {
        window.Kakao.Auth.login({
            scope: "profile_nickname, account_email",
            success: async function () {
                try {
                    const res = await window.Kakao.API.request({ url: "/v2/user/me" });
=======
    const loginWithKakao = async () => {
        window.Kakao.Auth.login({
            scope: "profile_nickname, account_email",
            success: async function (authObj) {
                console.log("🟢 로그인 성공", authObj);

                try {
                    const res = await window.Kakao.API.request({
                        url: "/v2/user/me",
                    });

                    console.log("🙋 사용자 정보", res);

>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
                    const nickname = res.kakao_account.profile.nickname;
                    const email = res.kakao_account.email;

                    // Firestore에 사용자 정보 저장
                    await setDoc(doc(db, "users", email), {
                        nickname,
                        email,
                        timestamp: new Date(),
                    });

<<<<<<< HEAD
                    // 로컬스토리지에 사용자 정보 저장
                    localStorage.setItem("user", JSON.stringify({ nickname, email }));

                    alert(`환영합니다, ${nickname}님!`);
                    window.location.reload(); // 새로고침으로 반영
                } catch (error) {
                    console.error("❌ 사용자 정보 요청 실패:", error);
                    alert("사용자 정보를 불러오는 데 실패했습니다.");
                }
            },
            fail: function (err) {
                console.error("❌ 로그인 실패:", err);
                alert("로그인에 실패했습니다. 다시 시도해주세요.");
=======
                    // localStorage에 로그인 정보 저장
                    localStorage.setItem("user", JSON.stringify({ nickname, email }));

                    alert(`환영합니다, ${nickname}님!`);
                    window.location.reload(); // 새로고침으로 로그인 상태 반영
                } catch (error) {
                    console.error("❌ 사용자 정보 요청 실패", error);
                }
            },
            fail: function (err) {
                console.error("❌ 로그인 실패", err);
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
            },
        });
    };

<<<<<<< HEAD
    // ✅ 카카오 로그아웃
    const logoutFromKakao = () => {
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                localStorage.removeItem("user");
                alert("로그아웃 되었습니다.");
                window.location.reload();
            });
        } else {
            console.log("🔁 이미 로그아웃 상태입니다.");
=======
    const logoutFromKakao = () => {
        if (window.Kakao.Auth.getAccessToken()) {
            window.Kakao.Auth.logout(() => {
                console.log("🧼 로그아웃 완료");
                localStorage.removeItem("user");
                window.location.reload();
            });
        } else {
            console.log("이미 로그아웃된 상태입니다.");
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
        }
    };

    const user = JSON.parse(localStorage.getItem("user"));

    return (
<<<<<<< HEAD
        <div style={{ textAlign: "center" }}>
=======
        <div>
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
            {user ? (
                <>
                    <h2>{user.nickname}님 안녕하세요 👋</h2>
                    <p>{user.email}</p>
                    <button
                        onClick={logoutFromKakao}
<<<<<<< HEAD
                        style={styles.logoutBtn}
=======
                        style={{
                            marginTop: "1rem",
                            backgroundColor: "#ccc",
                            border: "none",
                            borderRadius: "8px",
                            padding: "10px 20px",
                            cursor: "pointer",
                            fontSize: "16px",
                        }}
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
                    >
                        로그아웃
                    </button>
                </>
            ) : (
                <button
                    onClick={loginWithKakao}
<<<<<<< HEAD
                    style={styles.kakaoBtn}
=======
                    style={{
                        backgroundColor: "#FEE500",
                        border: "none",
                        borderRadius: "8px",
                        padding: "10px 20px",
                        fontWeight: "bold",
                        cursor: "pointer",
                        color: "#000",
                        fontSize: "16px",
                    }}
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
                >
                    카카오톡으로 로그인
                </button>
            )}
        </div>
    );
};

<<<<<<< HEAD
const styles = {
    kakaoBtn: {
        backgroundColor: "#FEE500",
        border: "none",
        borderRadius: "8px",
        padding: "10px 20px",
        fontWeight: "bold",
        cursor: "pointer",
        color: "#000",
        fontSize: "16px",
    },
    logoutBtn: {
        marginTop: "1rem",
        backgroundColor: "#ccc",
        border: "none",
        borderRadius: "8px",
        padding: "10px 20px",
        cursor: "pointer",
        fontSize: "16px",
    },
};

export default KakaoLoginButton;
=======
export default KakaoLoginButton;
>>>>>>> c6dfbe6ee8e1ab55b28642cc0a930cabe7a9ec66
