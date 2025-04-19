import { useState } from "react";

const interestsList = [
    "🎬 영화", "💪 운동", "📚 독서", "🎮 게임", "🎧 음악",
    "🍳 요리", "🚶 산책", "📸 사진", "🎨 드로잉", "📖 자격증 공부",
    "✍️ 글쓰기", "📺 넷플릭스", "♟️ 보드게임", "🐶 반려동물",
    "📺 애니메이션", "📚 웹툰", "🚴 자전거", "🗣️ TMI 수다",
    "🏕️ 캠핑", "☕ 카페 탐방"
];

const UserPreferenceForm = ({ onSave }) => {
    const [interests, setInterests] = useState([]);
    const [timeStart, setTimeStart] = useState("09:00");
    const [timeEnd, setTimeEnd] = useState("18:00");
    const [gender, setGender] = useState("");
    const [ageGroup, setAgeGroup] = useState("");

    const toggleInterest = (item) => {
        setInterests((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({ interests, timeRange: `${timeStart} ~ ${timeEnd}`, gender, ageGroup });
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <h3>성별</h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                {['남자', '여자', '무응답'].map((option) => (
                    <label key={option}>
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

            <h3>나이대</h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                {['20대', '30대'].map((option) => (
                    <label key={option}>
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

            <h3>관심사 선택</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                {interestsList.map((item) => (
                    <button
                        type="button"
                        key={item}
                        onClick={() => toggleInterest(item)}
                        style={{
                            backgroundColor: interests.includes(item) ? "#90cdf4" : "#eee",
                            padding: "8px 12px",
                            borderRadius: "8px",
                            border: "none",
                            cursor: "pointer",
                        }}
                    >
                        {item}
                    </button>
                ))}
            </div>

            <h3 style={{ marginTop: "1.5rem" }}>참여 가능 시간 (24시간)</h3>
            <div style={{ display: "flex", gap: "10px" }}>
                <input
                    type="time"
                    value={timeStart}
                    onChange={(e) => setTimeStart(e.target.value)}
                    required
                />
                <span>~</span>
                <input
                    type="time"
                    value={timeEnd}
                    onChange={(e) => setTimeEnd(e.target.value)}
                    required
                />
            </div>

            <button
                type="submit"
                style={{
                    marginTop: "20px",
                    backgroundColor: "#4CAF50",
                    color: "#fff",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "8px",
                    cursor: "pointer",
                }}
            >
                저장하기
            </button>
        </form>
    );
};

export default UserPreferenceForm;
