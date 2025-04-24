import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const personalityOptions = [
    "외향적", "내향적",
    "계획적인", "즉흥적인",
    "리더형", "서포터형"
];

function StepPersonality({ formData, onChange, onNext, onBack }) {
    const selected = formData.personality;
    const isNextEnabled = !!selected;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6 }}
            style={containerStyle}
        >
            {/* 왼쪽 상단 ← 버튼 */}
            <button style={backButtonStyle} onClick={onBack}>←</button>

            <motion.h2
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={headingStyle}
            >
                😊 당신의 성격을 가장 잘 나타내는<br />키워드를 골라주세요
            </motion.h2>

            <div style={gridStyle}>
                <AnimatePresence>
                    {personalityOptions.map((option) => (
                        <motion.button
                            key={option}
                            onClick={() => onChange({ personality: option })}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ type: "spring", stiffness: 300 }}
                            style={{
                                ...tagButtonStyle,
                                backgroundColor: selected === option ? "#6c63ff" : "#f0f0f0",
                                color: selected === option ? "#fff" : "#000",
                            }}
                        >
                            {option}
                        </motion.button>
                    ))}
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

// 스타일 정의
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

export default StepPersonality;
