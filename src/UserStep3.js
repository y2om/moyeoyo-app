import React, { useState } from "react";

const traitOptions = [
    "🗣️ 활발한 대화를 좋아해요",
    "🤫 조용한 분위기를 선호해요",
    "👋 처음 보는 사람과 금방 친해져요",
    "🧍 익숙해지기까지 시간이 좀 걸려요",
    "🧭 주도적으로 활동하는 걸 좋아해요",
    "🧑‍🤝‍🧑 따라가는 게 편해요",
    "🌞 밝고 유쾌한 분위기",
    "🌙 차분하고 조용한 분위기"
];

const UserStep3 = ({ onSubmit, setFormData }) => {
    const [selectedTraits, setSelectedTraits] = useState([]);

    const toggleTrait = (item) => {
        setSelectedTraits((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const handleSubmit = () => {
        if (selectedTraits.length === 0) {
            alert("성향을 하나 이상 선택해주세요.");
            return;
        }
        setFormData(prev => ({ ...prev, traits: selectedTraits }));
        onSubmit();
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>🧭 당신의 성향은 어떤가요?</h2>
            <p style={{ marginBottom: "2rem" }}>함께하는 사람들과 잘 어울릴 수 있도록 당신의 성향을 알려주세요.</p>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "2rem"
            }}>
                {traitOptions.map((item) => (
                    <button
                        type="button"
                        key={item}
                        onClick={() => toggleTrait(item)}
                        style={{
                            backgroundColor: selectedTraits.includes(item) ? "#f6ad55" : "#eee",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <button
                onClick={handleSubmit}
                style={{
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                저장하기
            </button>
        </div>
    );
};

export default UserStep3;
