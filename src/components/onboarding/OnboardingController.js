import React, { useState, useEffect } from "react";
import StepGenderAge from "./steps/StepGenderAge";
import StepInterestSelect from "./steps/StepInterestSelect";
import StepPersonality from "./steps/StepPersonality";
import StepTimeSelectRange from "./steps/StepTimeSelectRange";
import StepLocationSelect from "./steps/StepLocationSelect";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

function OnboardingController({ user, onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        gender: "",
        ageGroup: "",
        interests: [],
        personality: "",
        availableTimes: [],
        location: ""
    });

    const [shouldSubmit, setShouldSubmit] = useState(false); // 🔑 이게 핵심

    // 🔥 상태가 완전히 반영된 후에만 제출
    useEffect(() => {
        if (shouldSubmit) {
            handleFinalSubmit();
        }
    }, [shouldSubmit, formData]);

    const handleChange = (updatedData) => {
        setFormData((prev) => ({
            ...prev,
            ...updatedData
        }));
    };

    const handleNext = () => {
        if (step < 5) {
            setStep(step + 1);
        } else {
            setShouldSubmit(true); // 📌 상태 업데이트 후 제출
        }
    };

    const handleFinalSubmit = async () => {
        console.log("🔥 저장 직전 formData:", formData); // 확인용 로그
        try {
            await setDoc(doc(db, "users", user.email), {
                ...formData,
                email: user.email,
                createdAt: serverTimestamp()
            });
            console.log("✅ 사용자 정보 저장 완료");
            if (onComplete) onComplete(formData);
        } catch (error) {
            console.error("❌ 저장 실패:", error);
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return (
                    <StepGenderAge
                        formData={formData}
                        onChange={handleChange}
                        onNext={handleNext}
                    />
                );
            case 2:
                return (
                    <StepInterestSelect
                        formData={formData}
                        onChange={handleChange}
                        onNext={handleNext}
                    />
                );
            case 3:
                return (
                    <StepPersonality
                        formData={formData}
                        onChange={handleChange}
                        onNext={handleNext}
                    />
                );
            case 4:
                return (
                    <StepTimeSelectRange
                        setFormData={handleChange}
                        onNext={handleNext}
                    />
                );
            case 5:
                return (
                    <StepLocationSelect
                        setFormData={handleChange}
                        onNext={handleNext}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", paddingTop: "2rem" }}>
            <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
                마주침 시작을 위한 정보를 입력해주세요 ({step}/5)
            </h2>
            {renderStep()}
        </div>
    );
}

export default OnboardingController;
