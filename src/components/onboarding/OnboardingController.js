// src/components/onboarding/OnboardingController.js
import React, { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";                  // Firebase 연결
import FullOnboarding from "./steps/FullOnboarding";   // 단계별 폼 컴포넌트

export default function OnboardingController({ user, onComplete }) {
    const [formData, setFormData] = useState({
        gender: "",
        ageGroup: "",
        interests: [],
        personality: "",
        availableTimes: [],   // [{ datetime: "2025-05-02T14:30" }, …]
        location: {           // { latitude, longitude }
            latitude: null,
            longitude: null
        },
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 1) 로그인 여부 체크 → 없으면 로그인 페이지로
    useEffect(() => {
        if (!user) {
            window.location.href = "/login";
        }
    }, [user]);

    // 2) 진입하자마자 위치 정보 요청
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                ({ coords }) => {
                    setFormData(fd => ({
                        ...fd,
                        location: {
                            latitude: coords.latitude,
                            longitude: coords.longitude
                        }
                    }));
                },
                err => console.warn("위치 권한 거부됨:", err),
                { enableHighAccuracy: true }
            );
        }
    }, []);

    // 3) isSubmitting 플래그가 켜지면 저장 로직 실행
    useEffect(() => {
        if (isSubmitting) saveUserInfo();
    }, [isSubmitting]);

    // “완료하기” 버튼 클릭 시
    const handleNext = () => {
        setIsSubmitting(true);
    };

    // Firestore에 저장
    const saveUserInfo = async () => {
        try {
            await setDoc(doc(db, "users", user.email), {
                ...formData,
                email: user.email,
                createdAt: serverTimestamp(),
            });
            onComplete && onComplete(formData);
        } catch (err) {
            console.error("❌ 사용자 정보 저장 실패:", err);
            setIsSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <header style={styles.header}>
                    <h2 style={styles.title}>🎉 마주침 시작을 위한 정보 입력</h2>
                    <p style={styles.subtitle}>아래 단계를 모두 완료해 주세요</p>
                </header>
                <main style={styles.content}>
                    <FullOnboarding
                        formData={formData}
                        setFormData={setFormData}
                        onNext={handleNext}
                    />
                </main>
                <footer style={styles.footer}>
                    <button
                        onClick={handleNext}
                        disabled={isSubmitting}
                        style={{
                            ...styles.button,
                            ...(isSubmitting ? styles.buttonDisabled : {})
                        }}
                    >
                        {isSubmitting ? "저장 중…" : "완료하기"}
                    </button>
                </footer>
            </div>
        </div>
    );
}

const styles = {
    page: {
        display: "flex",
        justifyContent: "center",
        padding: "2rem 1rem",
        background: "#f0f4f8",
        minHeight: "100vh",
        fontFamily: "Noto Sans KR, sans-serif",
    },
    card: {
        width: "100%",
        maxWidth: "620px",
        background: "#fff",
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    header: {
        padding: "24px",
        borderBottom: "1px solid #e2e8f0",
        textAlign: "center",
    },
    title: {
        margin: 0,
        fontSize: "1.6rem",
        color: "#1f2937",
        fontWeight: 600,
    },
    subtitle: {
        margin: "8px 0 0",
        fontSize: "0.95rem",
        color: "#4b5563",
    },
    content: {
        padding: "24px",
        flex: 1,
    },
    footer: {
        padding: "16px 24px",
        borderTop: "1px solid #e2e8f0",
        textAlign: "right",
    },
    button: {
        backgroundColor: "#2563eb",
        color: "#fff",
        border: "none",
        borderRadius: "8px",
        padding: "12px 24px",
        fontSize: "1rem",
        fontWeight: 500,
        cursor: "pointer",
        transition: "background-color 0.2s ease",
    },
    buttonDisabled: {
        backgroundColor: "#93c5fd",
        cursor: "not-allowed",
    },
};
