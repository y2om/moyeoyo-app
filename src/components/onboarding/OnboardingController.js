import React, { useState, useEffect } from "react";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase"; // 🔥 firebase 연결 경로 주의
import FullOnboarding from "./steps/FullOnboarding"; // 🔥 FullOnboarding 연결

function OnboardingController({ user, onComplete }) {
    const [formData, setFormData] = useState({
        gender: "",
        ageGroup: "",
        interests: [],
        personality: "",
        availableTimes: [],  // 시간/날짜 등록 리스트
        location: "",
    });

    const [shouldSubmit, setShouldSubmit] = useState(false);

    useEffect(() => {
        if (shouldSubmit) {
            handleFinalSubmit();
        }
    }, [shouldSubmit]);

    const handleNext = () => {
        console.log("➡️ 전체 입력 완료, formData:", formData);
        setShouldSubmit(true);
    };

    const handleFinalSubmit = async () => {
        console.log("🔥 저장 직전 formData:", formData);
        try {
            await setDoc(doc(db, "users", user.email), {
                ...formData,
                email: user.email,
                createdAt: serverTimestamp(),
            });
            console.log("✅ 사용자 정보 저장 완료");
            if (onComplete) onComplete(formData);
        } catch (error) {
            console.error("❌ 사용자 정보 저장 실패:", error);
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "2rem" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                마주침 시작을 위한 정보를 입력해주세요
            </h2>
            <FullOnboarding
                formData={formData}
                setFormData={setFormData}
                onNext={handleNext}
            />
        </div>
    );
}

export default OnboardingController;
