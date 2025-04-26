import React, { useState } from "react";
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
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");

    // 공통 넘어가기
    const goNextStep = () => {
        if (currentStep === "gender") setCurrentStep("age");
        else if (currentStep === "age") setCurrentStep("interest");
        else if (currentStep === "interest") setCurrentStep("personality");
        else if (currentStep === "personality") setCurrentStep("time");
        else if (currentStep === "time") setCurrentStep("location");
        else if (currentStep === "location") onNext();
    };

    // 성별 선택
    const handleGenderSelect = (gender) => {
        setFormData({ ...formData, gender });
        setTimeout(goNextStep, 300);
    };

    // 연령대 선택
    const handleAgeSelect = (ageGroup) => {
        setFormData({ ...formData, ageGroup });
        setTimeout(goNextStep, 300);
    };

    // 관심사 선택
    const toggleInterest = (interest) => {
        const isSelected = localSelectedInterests.includes(interest);
        const updated = isSelected
            ? localSelectedInterests.filter((i) => i !== interest)
            : [...localSelectedInterests, interest];

        setLocalSelectedInterests(updated);
        setFormData({ ...formData, interests: updated });
    };

    // 성격 선택
    const handlePersonalitySelect = (personality) => {
        setFormData({ ...formData, personality });
        setTimeout(goNextStep, 300);
    };

    // 날짜/시간 추가
    const handleAddTime = () => {
        if (!date || !startTime || !endTime) {
            alert("날짜와 시작/종료 시간을 모두 입력해주세요.");
            return;
        }
        const newEntry = { date, timeRange: `${startTime} ~ ${endTime}` };
        const updatedTimes = [...(formData.availableTimes || []), newEntry];
        setFormData({ ...formData, availableTimes: updatedTimes });
        setDate("");
        setStartTime("09:00");
        setEndTime("18:00");
    };

    // 위치 선택
    const handleLocationSelect = (e) => {
        setFormData({ ...formData, location: e.target.value });
    };

    // 뒤로가기
    const handleBack = () => {
        if (currentStep === "location") setCurrentStep("time");
        else if (currentStep === "time") setCurrentStep("personality");
        else if (currentStep === "personality") setCurrentStep("interest");
        else if (currentStep === "interest") setCurrentStep("age");
        else if (currentStep === "age") setCurrentStep("gender");
    };

    // 다음버튼 클릭
    const handleNext = () => {
        if (currentStep === "interest") setCurrentStep("personality");
        else if (currentStep === "time") setCurrentStep("location");
        else if (currentStep === "location") onNext();
    };

    // 다음버튼 활성화 조건
    const isNextEnabled = () => {
        if (currentStep === "interest") return localSelectedInterests.length > 0;
        if (currentStep === "time") return (formData.availableTimes || []).length > 0;
        if (currentStep === "location") return formData.location;
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
                            <div style={{ display: "flex", gap: "10px" }}>
                                <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} style={inputStyle} />
                                <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} style={inputStyle} />
                            </div>
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
                        <img src="/seoul-map.png" alt="서울 지도" style={{ width: "100%", borderRadius: "12px" }} />
                        <select value={formData.location} onChange={handleLocationSelect} style={selectStyle}>
                            <option value="">-- 자치구를 골라주세요 --</option>
                            {["강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
                                "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구",
                                "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구", "종로구",
                                "중구", "중랑구"].map((district) => (
                                    <option key={district} value={district}>{district}</option>
                                ))}
                        </select>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* 다음 버튼 (interest / time / location 단계에서만 표시) */}
            {["interest", "time", "location"].includes(currentStep) && (
                <button
                    onClick={handleNext}
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
const selectStyle = { width: "80%", padding: "12px", fontSize: "1.1rem", borderRadius: "10px", border: "1px solid #ccc" };
const inputStyle = { padding: "10px", borderRadius: "8px", border: "1px solid #ccc", fontSize: "1rem" };
const addButtonStyle = { marginTop: "10px", padding: "10px 16px", backgroundColor: "#edf2f7", border: "none", borderRadius: "10px", fontSize: "1rem", cursor: "pointer" };
const listItemStyle = { backgroundColor: "#f7fafc", padding: "10px 16px", borderRadius: "10px", width: "100%", marginTop: "5px" };
const motionSettings = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20 }, transition: { duration: 0.5 } };

