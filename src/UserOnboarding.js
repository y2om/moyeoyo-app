import React, { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";
import UserStep1 from "./UserStep1";
import UserStep2 from "./UserStep2";
import UserStep3 from "./UserStep3";
import UserStep4 from "./UserStep4";
import UserStep5 from "./UserStep5";

const UserOnboarding = ({ user, onComplete }) => {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        gender: "",
        ageGroup: "",
        interests: [],
        traits: [],
        availableTimes: [],
        location: ""
    });

    const handleNext = () => setStep((prev) => prev + 1);

    const handleSave = async () => {
        try {
            await setDoc(doc(db, "users", user.email), {
                ...user,
                ...formData,
                updatedAt: new Date()
            });
            alert("✅ 정보가 저장되었습니다!");
            onComplete(formData); // 🎯 App으로 사용자 정보 전달
        } catch (error) {
            console.error("❌ 저장 실패:", error);
            alert("정보 저장에 실패했습니다.");
        }
    };

    return (
        <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
            {step === 1 && <UserStep1 onNext={handleNext} setFormData={setFormData} />}
            {step === 2 && <UserStep2 onNext={handleNext} setFormData={setFormData} />}
            {step === 3 && <UserStep3 onNext={handleNext} setFormData={setFormData} />}
            {step === 4 && <UserStep4 onNext={handleNext} setFormData={setFormData} />}
            {step === 5 && <UserStep5 onNext={handleSave} setFormData={setFormData} />}
        </div>
    );
};

export default UserOnboarding;
