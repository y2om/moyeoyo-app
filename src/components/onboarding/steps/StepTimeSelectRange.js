import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

function StepTimeSelectRange({ onNext, setFormData }) {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");
    const [availableTimes, setAvailableTimes] = useState([]);

    const handleAdd = () => {
        if (!date || !startTime || !endTime) {
            alert("날짜와 시간을 모두 입력해주세요.");
            return;
        }

        const newEntry = { date, timeRange: `${startTime} ~ ${endTime}` };

        const exists = availableTimes.some(
            (item) =>
                item.date === newEntry.date &&
                item.timeRange === newEntry.timeRange
        );

        if (!exists) {
            setAvailableTimes((prev) => [...prev, newEntry]);
            setDate("");
        } else {
            alert("이미 등록된 일정입니다.");
        }
    };

    const handleNext = () => {
        if (availableTimes.length === 0) {
            alert("한 개 이상의 가능한 일정을 등록해주세요!");
            return;
        }

        console.log("🕒 저장 전 availableTimes:", availableTimes); // ✅ 디버깅용
        setFormData((prev) => ({ ...prev, availableTimes }));
        if (onNext) onNext();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={containerStyle}
        >
            <motion.h2 style={headingStyle}>⏰ 함께할 수 있는 시간을 알려주세요</motion.h2>
            <p style={subTextStyle}>
                날짜와 시간대를 등록해주세요. 겹치는 시간이 있어야 만남이 가능해요!
            </p>

            <div style={inputRowStyle}>
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    style={inputStyle}
                />
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    style={inputStyle}
                />
                <span style={{ fontSize: "1.2rem" }}>~</span>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    style={inputStyle}
                />
                <button onClick={handleAdd} style={addButtonStyle}>
                    ➕ 추가
                </button>
            </div>

            <div style={listContainerStyle}>
                <AnimatePresence>
                    {availableTimes.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                            style={listItemStyle}
                        >
                            📅 {item.date} | ⏰ {item.timeRange}
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>

            <button onClick={handleNext} style={nextButtonStyle}>
                다음으로
            </button>
        </motion.div>
    );
}

// 스타일
const containerStyle = {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const headingStyle = {
    fontSize: "1.6rem",
    lineHeight: "2.2rem",
};

const subTextStyle = {
    fontSize: "1rem",
    color: "#666",
    marginTop: "-10px",
};

const inputRowStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
    alignItems: "center",
};

const inputStyle = {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
};

const addButtonStyle = {
    padding: "10px 16px",
    backgroundColor: "#edf2f7",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "1rem",
};

const listContainerStyle = {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    marginTop: "1rem",
};

const listItemStyle = {
    backgroundColor: "#f7fafc",
    padding: "12px 16px",
    borderRadius: "12px",
    textAlign: "left",
    boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
};

const nextButtonStyle = {
    marginTop: "1.5rem",
    padding: "14px 32px",
    backgroundColor: "#2b6cb0",
    color: "#fff",
    fontSize: "1.1rem",
    fontWeight: "500",
    border: "none",
    borderRadius: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
};

export default StepTimeSelectRange;
