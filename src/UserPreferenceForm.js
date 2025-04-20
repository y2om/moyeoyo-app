import { useState } from "react";

const interestsList = [
    "🎬 영화", "💪 운동", "📚 독서", "🎮 게임", "🎧 음악",
    "🍳 요리", "🚶 산책", "📸 사진", "🎨 드로잉", "📖 자격증 공부",
    "✍️ 글쓰기", "📺 넷플릭스", "♟️ 보드게임", "🐶 반려동물",
    "📺 애니메이션", "📚 웹툰", "🚴 자전거", "🗣️ TMI 수다",
    "🏕️ 캠핑", "☕ 카페 탐방"
];

const seoulDistricts = [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구", "구로구", "금천구",
    "노원구", "도봉구", "동대문구", "동작구", "마포구", "서대문구", "서초구",
    "성동구", "성북구", "송파구", "양천구", "영등포구", "용산구", "은평구",
    "종로구", "중구", "중랑구"
];

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

const UserPreferenceForm = ({ user, onSaved }) => {
    const [interests, setInterests] = useState([]);
    const [traits, setTraits] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [date, setDate] = useState("");
    const [timeStart, setTimeStart] = useState("09:00");
    const [timeEnd, setTimeEnd] = useState("18:00");
    const [gender, setGender] = useState("");
    const [ageGroup, setAgeGroup] = useState("");
    const [location, setLocation] = useState("");

    const toggleInterest = (item) => {
        setInterests((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const toggleTrait = (item) => {
        setTraits((prev) =>
            prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
        );
    };

    const handleAddTime = () => {
        if (!date || !timeStart || !timeEnd) {
            alert("⛔ 날짜 및 시간을 모두 입력해주세요.");
            return;
        }

        const newEntry = { date, timeRange: `${timeStart} ~ ${timeEnd}` };
        const exists = availableTimes.some(
            (entry) => entry.date === newEntry.date && entry.timeRange === newEntry.timeRange
        );

        if (!exists) {
            setAvailableTimes((prev) => [...prev, newEntry]);
        }

        setDate("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!location) {
            alert("⛔ 위치(자치구)를 선택해주세요.");
            return;
        }
        if (availableTimes.length === 0) {
            alert("⛔ 최소 1개의 참여 가능한 날짜 및 시간을 추가해주세요.");
            return;
        }

        const userData = {
            interests,
            traits,
            availableTimes,
            gender,
            ageGroup,
            location,
            updatedAt: new Date()
        };

        try {
            const { doc, setDoc } = await import("firebase/firestore");
            const { db } = await import("./firebase");
            await setDoc(doc(db, "users", user.email), {
                ...user,
                ...userData
            });

            alert("✅ 정보가 저장되었습니다!");
            if (onSaved) onSaved();
        } catch (err) {
            console.error("❌ 저장 실패:", err);
            alert("❌ 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ marginTop: "2rem" }}>
            <h3>성별</h3>
            <div style={{ display: "flex", gap: "10px", marginBottom: "1rem" }}>
                {["남자", "여자", "무응답"].map((option) => (
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
                {["20대", "30대"].map((option) => (
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
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1rem" }}>
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

            <h3>성향 선택</h3>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "1rem" }}>
                {traitOptions.map((item) => (
                    <button
                        type="button"
                        key={item}
                        onClick={() => toggleTrait(item)}
                        style={{
                            backgroundColor: traits.includes(item) ? "#f6ad55" : "#eee",
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

            <h3>참여 가능한 날짜 및 시간</h3>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", marginBottom: "1rem" }}>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                <input type="time" value={timeStart} onChange={(e) => setTimeStart(e.target.value)} />
                <span>~</span>
                <input type="time" value={timeEnd} onChange={(e) => setTimeEnd(e.target.value)} />
                <button type="button" onClick={handleAddTime}>추가하기</button>
            </div>

            {availableTimes.length > 0 && (
                <ul style={{ marginTop: "1rem" }}>
                    {availableTimes.map((item, idx) => (
                        <li key={idx}>
                            📅 {item.date} | ⏰ {item.timeRange}
                        </li>
                    ))}
                </ul>
            )}

            <h3>서울시 자치구 선택</h3>
            <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                style={{ marginTop: "10px", padding: "8px", borderRadius: "6px" }}
            >
                <option value="">-- 선택하세요 --</option>
                {seoulDistricts.map((gu) => (
                    <option key={gu} value={gu}>{gu}</option>
                ))}
            </select>

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
