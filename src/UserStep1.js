import React, { useState } from "react";

const UserStep1 = ({ onNext, setFormData }) => {
    const [gender, setGender] = useState("");
    const [ageGroup, setAgeGroup] = useState("");

    const handleNext = () => {
        if (!gender || !ageGroup) {
            alert("성별과 나이대를 선택해주세요.");
            return;
        }
        setFormData(prev => ({ ...prev, gender, ageGroup }));
        onNext();
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>🌸 {"당신의 이야기를 들려주세요."}</h2>
            <p style={{ marginBottom: "2rem" }}>당신은 어떤 사람인가요? 성별과 나이대를 알려주세요!</p>

            <div style={{ marginBottom: "1.5rem" }}>
                <h3>성별</h3>
                {["남자", "여자", "무응답"].map(option => (
                    <label key={option} style={{ margin: "0 10px" }}>
                        <input
                            type="radio"
                            name="gender"
                            value={option}
                            checked={gender === option}
                            onChange={(e) => setGender(e.target.value)}
                        /> {option}
                    </label>
                ))}
            </div>

            <div style={{ marginBottom: "2rem" }}>
                <h3>나이대</h3>
                {["20대", "30대"].map(option => (
                    <label key={option} style={{ margin: "0 10px" }}>
                        <input
                            type="radio"
                            name="ageGroup"
                            value={option}
                            checked={ageGroup === option}
                            onChange={(e) => setAgeGroup(e.target.value)}
                        /> {option}
                    </label>
                ))}
            </div>

            <button
                onClick={handleNext}
                style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                다음으로
            </button>
        </div>
    );
};

export default UserStep1;
