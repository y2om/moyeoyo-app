import React from "react";
import { motion, AnimatePresence } from "framer-motion";

function StepGenderAge({ formData, onChange, onNext }) {
    const handleGenderSelect = (gender) => {
        onChange({ gender });
    };

    const handleAgeSelect = (ageGroup) => {
        onChange({ ageGroup });
        setTimeout(() => onNext(), 500); // 자동 다음
    };

    const handleBack = () => {
        if (formData.ageGroup) {
            onChange({ ageGroup: null });
        } else if (formData.gender) {
            onChange({ gender: null });
        }
    };

    return (
        <div style={containerStyle}>
            {(formData.gender || formData.ageGroup) && (
                <button style={backButtonStyle} onClick={handleBack}>
                    ←
                </button>
            )}

            <AnimatePresence mode="wait">
                {!formData.gender && (
                    <motion.div
                        key="gender"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                        style={stepStyle}
                    >
                        <h2 style={headingStyle}>성별을 알려주세요 😊</h2>
                        <div style={buttonRowStyle}>
                            <button onClick={() => handleGenderSelect("남성")} style={buttonStyle(formData.gender === "남성", "#2b6cb0")}>
                                👨 남성
                            </button>
                            <button onClick={() => handleGenderSelect("여성")} style={buttonStyle(formData.gender === "여성", "#ed64a6")}>
                                👩 여성
                            </button>
                        </div>
                    </motion.div>
                )}

                {formData.gender && !formData.ageGroup && (
                    <motion.div
                        key="age"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -30 }}
                        transition={{ duration: 0.5 }}
                        style={stepStyle}
                    >
                        <h2 style={headingStyle}>
                            {formData.gender === "남성" ? "반가워요 🙋‍♂️" : "반가워요 🙋‍♀️"}<br />
                            연령대를 선택해주세요!
                        </h2>
                        <div style={buttonRowStyle}>
                            {["20대", "30대"].map((age) => (
                                <button key={age} onClick={() => handleAgeSelect(age)} style={buttonStyle(formData.ageGroup === age, "#3182ce")}>
                                    {age}
                                </button>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// 스타일 정의
const containerStyle = {
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
};

const backButtonStyle = {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
};

const stepStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    width: "100%",
    alignItems: "center",
    marginTop: "2rem",
};

const headingStyle = {
    textAlign: "center",
    fontSize: "1.6rem",
};

const buttonRowStyle = {
    display: "flex",
    gap: "16px",
    width: "100%",
    justifyContent: "center",
};

const buttonStyle = (isActive, color) => ({
    flex: 1,
    backgroundColor: isActive ? color : "#f0f0f0",
    color: isActive ? "#fff" : "#000",
    padding: "16px",
    borderRadius: "12px",
    border: "none",
    fontSize: "1.1rem",
    cursor: "pointer",
    transition: "all 0.2s ease-in-out",
});

export default StepGenderAge;
