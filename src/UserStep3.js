import React, { useState } from "react";

const traitList = [
    "🗣 활발한 대화를 좋아해요",
    "😌 조용한 분위기를 선호해요",
    "🧍‍♀️ 처음 보는 사람과 금방 친해져요",
    "🧍 익숙해지기까지 시간이 걸려요",
    "🌟 주도적인 걸 좋아해요",
    "🙌 따라가는 게 편해요",
    "🎉 밝고 유쾌한 분위기",
    "🌙 차분하고 조용한 분위기"
];

const UserStep3 = ({ onNext, setFormData }) => {
    const [selectedTraits, setSelectedTraits] = useState([]);

    const toggleTrait = (trait) => {
        setSelectedTraits((prev) =>
            prev.includes(trait)
                ? prev.filter((t) => t !== trait)
                : [...prev, trait]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormData((prev) => ({ ...prev, traits: selectedTraits }));
        if (onNext) onNext(); // ✅ 에러 원인이던 onSubmit → onNext로 수정
    };

    return (
        <form onSubmit={handleSubmit} style={{ textAlign: "center", padding: "2rem" }}>
            <h2>당신의 성향을 알려주세요</h2>
            <p style={{ color: "#666", marginBottom: "1.5rem" }}>
                더 잘 어울릴 수 있는 사람을 찾아드릴게요 💫
            </p>

            <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "10px" }}>
                {traitList.map((trait) => (
                    <button
                        key={trait}
                        type="button"
                        onClick={() => toggleTrait(trait)}
                        style={{
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: selectedTraits.includes(trait) ? "#90cdf4" : "#e2e8f0",
                            cursor: "pointer"
                        }}
                    >
                        {trait}
                    </button>
                ))}
            </div>

            <button
                type="submit"
                style={{
                    marginTop: "2rem",
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                다음으로
            </button>
        </form>
    );
};

export default UserStep3;
