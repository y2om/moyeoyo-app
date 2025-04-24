import React, { useState } from "react";

const UserStep4 = ({ onNext, setFormData }) => {
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("09:00");
    const [endTime, setEndTime] = useState("18:00");
    const [availableTimes, setAvailableTimes] = useState([]);

    const handleAdd = () => {
        if (!date || !startTime || !endTime) {
            alert("날짜와 시간을 모두 입력해주세요.");
            return;
        }

        const newEntry = {
            date,
            timeRange: `${startTime} ~ ${endTime}`,
        };

        const exists = availableTimes.some(
            (item) =>
                item.date === newEntry.date && item.timeRange === newEntry.timeRange
        );

        if (!exists) {
            setAvailableTimes((prev) => [...prev, newEntry]);
            setDate(""); // 초기화
        } else {
            alert("이미 등록된 일정입니다.");
        }
    };

    const handleNext = () => {
        if (availableTimes.length === 0) {
            alert("한 개 이상의 가능한 일정을 등록해주세요!");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            availableTimes,
        }));

        if (onNext) onNext();
    };

    return (
        <div style={{ maxWidth: "600px", margin: "2rem auto", textAlign: "center" }}>
            <h2>⏰ 가능한 날짜와 시간대를 알려주세요</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                함께할 수 있는 시간대가 겹쳐야 모임이 생겨요!
            </p>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "10px",
                    justifyContent: "center",
                    marginBottom: "1rem",
                }}
            >
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                />
                <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                />
                <span>~</span>
                <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                />
                <button type="button" onClick={handleAdd}>
                    추가하기
                </button>
            </div>

            <ul style={{ marginTop: "1rem", textAlign: "left" }}>
                {availableTimes.map((item, idx) => (
                    <li key={idx}>
                        📅 {item.date} | ⏰ {item.timeRange}
                    </li>
                ))}
            </ul>

            <button
                type="button"
                onClick={handleNext}
                style={{
                    marginTop: "2rem",
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                }}
            >
                다음으로
            </button>
        </div>
    );
};

export default UserStep4;
