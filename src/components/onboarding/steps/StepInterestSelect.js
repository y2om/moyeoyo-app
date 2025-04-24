import React from "react";
import { motion, AnimatePresence } from "framer-motion";

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

function StepInterestSelect({ formData, onChange, onNext, onBack }) {
    const toggleInterest = (interest) => {
        const current = formData.interests || [];
        const isSelected = current.includes(interest);
        const updated = isSelected
            ? current.filter((i) => i !== interest)
            : [...current, interest];

        onChange({ interests: updated });
    };

    const isNextEnabled = formData.interests.length > 0;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={containerStyle}
        >
            {/* 왼쪽 상단 이전 버튼 */}
            <button style={backButtonStyle} onClick={onBack}>
                ←
            </button>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={headingStyle}
            >
                💫 당신의 취향이 궁금해요<br />관심 있는 활동을 알려주세요
            </motion.h2>

            <div style={gridStyle}>
                <AnimatePresence>
                    {interestOptions.map(({ label, value }) => {
                        const selected = formData.interests.includes(value);
                        return (
                            <motion.button
                                key={value}
                                onClick={() => toggleInterest(value)}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                whileTap={{ scale: 0.95 }}
                                transition={{ type: "spring", stiffness: 300 }}
                                style={{
                                    ...tagButtonStyle,
                                    backgroundColor: selected ? "#2b6cb0" : "#f0f0f0",
                                    color: selected ? "#fff" : "#000",
                                }}
                            >
                                {label}
                            </motion.button>
                        );
                    })}
                </AnimatePresence>
            </div>

            <div style={nextButtonContainerStyle}>
                <button
                    onClick={onNext}
                    disabled={!isNextEnabled}
                    style={{
                        ...nextButtonStyle,
                        backgroundColor: isNextEnabled ? "#2b6cb0" : "#e2e8f0", // 🔵 파란색
                        color: isNextEnabled ? "#fff" : "#aaa",
                        cursor: isNextEnabled ? "pointer" : "not-allowed",
                    }}
                >
                    다음 ➡️
                </button>
            </div>
        </motion.div>
    );
}

// 스타일
const containerStyle = {
    padding: "2rem",
    maxWidth: "600px",
    margin: "0 auto",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    position: "relative",
};

const backButtonStyle = {
    position: "absolute",
    top: "1rem",
    left: "1rem",
    fontSize: "1.5rem",
    background: "none",
    border: "none",
    cursor: "pointer",
};

const headingStyle = {
    textAlign: "center",
    fontSize: "1.5rem",
    lineHeight: "2.2rem",
    marginTop: "2rem",
};

const gridStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: "center",
};

const tagButtonStyle = {
    padding: "10px 16px",
    borderRadius: "24px",
    border: "1px solid #ccc",
    fontSize: "1rem",
    cursor: "pointer",
};

const nextButtonContainerStyle = {
    marginTop: "32px",
    display: "flex",
    justifyContent: "center",
};

const nextButtonStyle = {
    padding: "14px 32px",
    borderRadius: "16px",
    border: "none",
    fontSize: "1.1rem",
    fontWeight: "500",
    transition: "all 0.3s ease",
};

export default StepInterestSelect;
