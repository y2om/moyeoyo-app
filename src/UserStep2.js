import React, { useState } from "react";

const interestsList = [
    "🎬 영화", "💪 운동", "📚 독서", "🎮 게임", "🎧 음악",
    "🍳 요리", "🚶 산책", "📸 사진", "🎨 드로잉", "📖 자격증 공부",
    "✍️ 글쓰기", "📺 넷플릭스", "♟️ 보드게임", "🐶 반려동물",
    "📺 애니메이션", "📚 웹툰", "🚴 자전거", "🗣️ TMI 수다",
    "🏕️ 캠핑", "☕ 카페 탐방"
];

const UserStep2 = ({ onNext, setFormData }) => {
    const [selectedInterests, setSelectedInterests] = useState([]);

    const toggleInterest = (item) => {
        setSelectedInterests((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const handleNext = () => {
        if (selectedInterests.length === 0) {
            alert("관심사를 하나 이상 선택해주세요.");
            return;
        }
        setFormData(prev => ({ ...prev, interests: selectedInterests }));
        onNext();
    };

    return (
        <div style={{ padding: "2rem", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>🎯 당신의 관심사를 알려주세요!</h2>
            <p style={{ marginBottom: "2rem" }}>무엇에 관심이 있나요? 마음에 드는 것을 골라주세요 💬</p>

            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "10px",
                marginBottom: "2rem"
            }}>
                {interestsList.map((item) => (
                    <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        style={{
                            backgroundColor: selectedInterests.includes(item) ? "#90cdf4" : "#eee",
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

export default UserStep2;
