import { useState } from "react";
import { db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

const interestsList = [
    "🎬 영화", "💪 운동", "📚 독서", "🎮 게임", "🎧 음악",
    "🍳 요리", "🚶 산책", "📸 사진", "🎨 드로잉", "📖 자격증 공부",
    "✍️ 글쓰기", "📺 넷플릭스", "♟️ 보드게임", "🐶 반려동물",
    "📺 애니메이션", "📚 웹툰", "🚴 자전거", "🗣️ TMI 수다",
    "🏕️ 캠핑", "☕ 카페 탐방"
];

const UserPreferenceForm = ({ user, onSaved }) => {
    const [interests, setInterests] = useState([]);
    const [availableTimes, setAvailableTimes] = useState([]);
    const [date, setDate] = useState("");
    const [timeStart, setTimeStart] = useState("09:00");
    const [timeEnd, setTimeEnd] = useState("18:00");
    const [gender, setGender] = useState("");
    const [ageGroup, setAgeGroup] = useState("");

    const toggleInterest = (item) => {
        setInterests((prev) =>
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

    const getDistrictFromCoords = async (lat, lng) => {
        try {
            const response = await fetch(
                `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lng}&y=${lat}`,
                {
                    headers: {
                        Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}`
                    }
                }
            );
            const data = await response.json();
            const regionInfo = data.documents?.[0];
            if (regionInfo?.region_1depth_name !== "서울특별시") {
                return "서울시 외 지역";
            }
            return regionInfo?.region_2depth_name || "위치 정보 없음";
        } catch (err) {
            console.error("위치 정보 변환 실패", err);
            return "위치 정보 없음";
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (availableTimes.length === 0) {
            alert("⛔ 최소 1개의 참여 가능한 날짜 및 시간을 추가해주세요.");
            return;
        }

        let location = "위치 정보 없음";
        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject);
            });
            const { latitude, longitude } = position.coords;
            location = await getDistrictFromCoords(latitude, longitude);
        } catch (error) {
            alert("⚠️ 위치 권한이 허용되지 않았거나 실패했습니다.");
        }

        const userData = {
            interests,
            availableTimes,
            gender,
            ageGroup,
            location,
            updatedAt: new Date()
        };

        await setDoc(doc(db, "users", user.email), {
            ...user,
            ...userData
        });

        alert("✅ 정보가 저장되었습니다!");
        if (onSaved) onSaved();
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

            <h3 style={{ marginTop: "1.5rem" }}>참여 가능한 날짜 및 시간</h3>
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
