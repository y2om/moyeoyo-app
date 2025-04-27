import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// 관심사 목록
const interestOptions = [
    { label: "🎬 영화", value: "영화" },
    { label: "🎧 음악", value: "음악" },
    { label: "📚 독서", value: "독서" },
    { label: "💪 운동", value: "운동" },
    { label: "🎮 게임", value: "게임" },
    { label: "✈️ 여행", value: "여행" },
    { label: "🍳 요리", value: "요리" },
    { label: "🤝 봉사", value: "봉사" },
    { label: "🧠 자기계발", value: "자기계발" },
    { label: "☕ 카페탐방", value: "카페탐방" },
    { label: "📸 사진", value: "사진" },
    { label: "🎲 보드게임", value: "보드게임" },
];

// 성격 키워드 목록
const personalityOptions = [
    "외향적", "내향적",
    "계획적인", "즉흥적인",
    "리더형", "서포터형"
];

function FullOnboarding({ formData, setFormData, onNext }) {
    const [currentStep, setCurrentStep] = useState("gender");
    const [localSelectedInterests, setLocalSelectedInterests] = useState(formData.interests || []);
    const [date, setDate] = useState("");
    const [startTime] = useState("09:00");
    const [endTime] = useState("18:00");
    const [addressInput, setAddressInput] = useState("");
    const locationInputRef = useRef();

    const goNextStep = () => {
        if (currentStep === "gender") setCurrentStep("age");
        else if (currentStep === "age") setCurrentStep("interest");
        else if (currentStep === "interest") setCurrentStep("personality");
        else if (currentStep === "personality") setCurrentStep("time");
        else if (currentStep === "time") setCurrentStep("location");
        else if (currentStep === "location") handleLocationSubmit();
    };

    const handleGenderSelect = (gender) => {
        setFormData({ ...formData, gender });
        setTimeout(goNextStep, 300);
    };

    const handleAgeSelect = (ageGroup) => {
        setFormData({ ...formData, ageGroup });
        setTimeout(goNextStep, 300);
    };

    const toggleInterest = (interest) => {
        const isSelected = localSelectedInterests.includes(interest);
        const updated = isSelected
            ? localSelectedInterests.filter((i) => i !== interest)
            : [...localSelectedInterests, interest];
        setLocalSelectedInterests(updated);
        setFormData({ ...formData, interests: updated });
    };

    const handlePersonalitySelect = (personality) => {
        setFormData({ ...formData, personality });
        setTimeout(goNextStep, 300);
    };

    const handleAddTime = () => {
        if (!date || !startTime || !endTime) {
            alert("날짜와 시간을 입력해주세요.");
            return;
        }
        const newEntry = { date, timeRange: `${startTime} ~ ${endTime}` };
        const updatedTimes = [...(formData.availableTimes || []), newEntry];
        setFormData({ ...formData, availableTimes: updatedTimes });
        setDate("");
    };

    const handleLocationSubmit = async () => {
        const REST_API_KEY = process.env.REACT_APP_KAKAO_REST_API_KEY;
        const locationText = addressInput.trim(); // 🔥 input 상태값 직접 사용

        if (!locationText) {
            alert("주소를 입력해주세요!");
            return;
        }

        try {
            const res = await fetch(`https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(locationText)}`, {
                headers: {
                    Authorization: `KakaoAK ${REST_API_KEY}`,
                },
            });
            const data = await res.json();

            if (!data || !data.documents || data.documents.length === 0) {
                alert("주소를 찾을 수 없습니다. 다시 입력해주세요.");
                return;
            }

            const firstResult = data.documents[0];
            const latitude = firstResult.y;
            const longitude = firstResult.x;

            setFormData({
                ...formData,
                location: locationText,
                latitude,
                longitude,
            });

            onNext(); // 완료 후 다음 단계로!
        } catch (error) {
            console.error("주소 검색 오류:", error);
            alert("주소 검색 중 오류가 발생했습니다.");
        }
    };

    const handleBack = () => {
        if (currentStep === "location") setCurrentStep("time");
        else if (currentStep === "time") setCurrentStep("personality");
        else if (currentStep === "personality") setCurrentStep("interest");
        else if (currentStep === "interest") setCurrentStep("age");
        else if (currentStep === "age") setCurrentStep("gender");
    };

    const isNextEnabled = () => {
        if (currentStep === "interest") return localSelectedInterests.length > 0;
        if (currentStep === "time") return (formData.availableTimes || []).length > 0;
        if (currentStep === "location") return addressInput.trim().length > 0;
        return true;
    };

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={containerStyle}>
            {currentStep !== "gender" && (
                <button style={backButtonStyle} onClick={handleBack}>←</button>
            )}

            <AnimatePresence mode="wait">
                {currentStep === "gender" && (
                    <motion.div key="gender" {...motionSettings} style={stepStyle}>
                        <h2 style={headingStyle}>✨ 당신을 어떻게 부르면 좋을까요?</h2>
                        <div style={buttonRowStyle}>
                            <button onClick={() => handleGenderSelect("남성")} style={buttonStyle(formData.gender === "남성", "#2b6cb0")}>👨 남성</button>
                            <button onClick={() => handleGenderSelect("여성")} style={buttonStyle(formData.gender === "여성", "#ed64a6")}>👩 여성</button>
                        </div>
                    </motion.div>
                )}

                {currentStep === "age" && (
                    <motion.div key="age" {...motionSettings} style={stepStyle}>
                        <h2 style={headingStyle}>✨ 당신과 가까운 나이대를 알려주세요</h2>
                        <div style={buttonRowStyle}>
                            {["20대", "30대"].map((age) => (
                                <button key={age} onClick={() => handleAgeSelect(age)} style={buttonStyle(formData.ageGroup === age, "#3182ce")}>{age}</button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {currentStep === "interest" && (
                    <motion.div key="interest" {...motionSettings} style={stepStyle}>
                        <h2 style={headingStyle}>✨ 요즘 당신을 설레게 하는 건 무엇인가요?</h2>
                        <div style={gridStyle}>
                            {interestOptions.map(({ label, value }) => (
                                <button
                                    key={value}
                                    onClick={() => toggleInterest(value)}
                                    style={{
                                        ...tagButtonStyle,
                                        backgroundColor: localSelectedInterests.includes(value) ? "#2b6cb0" : "#f0f0f0",
                                        color: localSelectedInterests.includes(value) ? "#fff" : "#000",
                                    }}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {currentStep === "personality" && (
                    <motion.div key="personality" {...motionSettings} style={stepStyle}>
                        <h2 style={headingStyle}>✨ 당신을 표현하는 단어를 골라주세요</h2>
                        <div style={gridStyle}>
                            {personalityOptions.map((option) => (
                                <button
                                    key={option}
                                    onClick={() => handlePersonalitySelect(option)}
                                    style={{
                                        ...tagButtonStyle,
                                        backgroundColor: formData.personality === option ? "#6c63ff" : "#f0f0f0",
                                        color: formData.personality === option ? "#fff" : "#000",
                                    }}
                                >
                                    {option}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}

                {currentStep === "time" && (
                    <motion.div key="time" {...motionSettings} style={stepStyle}>
                        <h2 style={headingStyle}>✨ 함께할 수 있는 시간을 입력해주세요</h2>
                        <div style={{ ...gridStyle, flexDirection: "column", alignItems: "center" }}>
                            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} style={inputStyle} />
                            <button onClick={handleAddTime} style={addButtonStyle}>➕ 추가</button>
                            {(formData.availableTimes || []).map((time, idx) => (
                                <div key={idx} style={listItemStyle}>📅 {time.date} | ⏰ {time.timeRange}</div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {currentStep === "location" && (
                    <motion.div key="location" {...motionSettings} style={stepStyle}>
                        <h2 style={headingStyle}>✨ 어디에서 마주치고 싶나요?</h2>
                        <input
                            type="text"
                            ref={locationInputRef}
                            value={addressInput}
                            onChange={(e) => setAddressInput(e.target.value)}
                            placeholder="도로명 주소를 입력해주세요"
                            style={inputStyle}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {["interest", "time", "location"].includes(currentStep) && (
                <button
                    onClick={goNextStep}
                    disabled={!isNextEnabled()}
                    style={{
                        ...nextButtonStyle,
                        marginTop: "2rem",
                        backgroundColor: isNextEnabled() ? "#2b6cb0" : "#e2e8f0",
                        color: isNextEnabled() ? "#fff" : "#aaa",
                    }}
                >
                    {currentStep === "location" ? "제출 ➡️" : "다음 ➡️"}
                </button>
            )}
        </motion.div>
    );
}

export default FullOnboarding;

// ===== 스타일 =====
const containerStyle = { padding: "2rem", maxWidth: "600px", margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" };
const stepStyle = { display: "flex", flexDirection: "column", gap: "32px", width: "100%", alignItems: "center", marginTop: "2rem" };
const backButtonStyle = { position: "absolute", top: "1rem", left: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer" };
const headingStyle = { textAlign: "center", fontSize: "1.6rem" };
const buttonRowStyle = { display: "flex", gap: "16px", width: "100%", justifyContent: "center" };
const buttonStyle = (isActive, color) => ({ flex: 1, backgroundColor: isActive ? color : "#f0f0f0", color: isActive ? "#fff" : "#000", padding: "16px", borderRadius: "12px", border: "none", fontSize: "1.1rem", cursor: "pointer", transition: "all 0.2s ease-in-out" });
const nextButtonStyle = { padding: "14px 32px", borderRadius: "16px", border: "none", fontSize: "1.1rem", fontWeight: "500", transition: "all 0.3s ease" };
const gridStyle = { display: "flex", flexWrap: "wrap", gap: "12px", justifyContent: "center" };
const tagButtonStyle = { padding: "10px 16px", borderRadius: "24px", border: "1px solid #ccc", fontSize: "1rem", cursor: "pointer" };
const inputStyle = { width: "80%", padding: "12px", fontSize: "1.1rem", borderRadius: "10px", border: "1px solid #ccc", marginTop: "1rem" };
const addButtonStyle = { marginTop: "10px", padding: "10px 16px", backgroundColor: "#edf2f7", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer" };
const listItemStyle = { backgroundColor: "#f7fafc", padding: "10px 16px", borderRadius: "10px", width: "100%", marginTop: "5px" };
const motionSettings = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.5 } };

