import React, { useEffect, useState } from "react";
import axios from "axios";

// ✅ 관심사 유사 키워드 매핑
const similarKeywords = {
    영화: ["영상", "영화", "시네마"],
    음악: ["콘서트", "음악", "밴드", "뮤직"],
    독서: ["책", "도서", "문학"],
    운동: ["운동", "체육", "스포츠"],
    게임: ["e스포츠", "게임", "플레이"],
    드로잉: ["미술", "그림", "드로잉", "아트"],
};

const TestSeoulEventAPI = ({ userData }) => {
    const [events, setEvents] = useState([]);
    const [fallbackEvents, setFallbackEvents] = useState([]);
    const [loading, setLoading] = useState(false);

    const API_KEY = "4557567a517962683130396479775446";

    // ✅ 초기 필터 상태 안전하게 구성
    const initialInterest = userData?.interests?.[0] || "음악";
    const initialDate = userData?.availableTimes?.[0]?.date || "2024-05-01";
    const initialGu = userData?.location || "강남구";

    const [filters, setFilters] = useState({
        interest: initialInterest,
        date: initialDate,
        gu: initialGu,
    });

    const fetchEvents = async (interest, date, gu, isFallback = false) => {
        setLoading(true);
        try {
            const url = `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/1/1000/`;
            const response = await axios.get(url);
            const data = response.data.culturalEventInfo?.row || [];

            const keywords = similarKeywords[interest] || [interest];

            const matched = data.filter(
                (item) =>
                    keywords.some((kw) => item.TITLE?.includes(kw)) &&
                    item.GUNAME === gu &&
                    (item.DATE?.includes(date) ||
                        (item.STRTDATE <= date && item.END_DATE >= date))
            );

            if (isFallback) {
                setFallbackEvents(matched);
            } else {
                setEvents(matched);
            }
        } catch (error) {
            console.error("문화행사 API 오류:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (filters.date && filters.gu) {
            fetchEvents(filters.interest, filters.date, filters.gu);
        }
    }, [filters]);

    const handleAdjust = (type) => {
        if (type === "date") {
            const newDate = new Date(filters.date);
            newDate.setDate(newDate.getDate() + 1);
            const nextDate = newDate.toISOString().split("T")[0];
            setFilters({ ...filters, date: nextDate });
        } else if (type === "time") {
            alert("⏰ 시간 필터는 현재 미지원입니다.");
        } else if (type === "location") {
            const guMap = {
                강남구: ["서초구", "송파구"],
                종로구: ["중구", "성북구"],
                마포구: ["서대문구", "용산구"],
            };
            const neighbors = guMap[filters.gu] || [];
            if (neighbors.length > 0) {
                setFilters({ ...filters, gu: neighbors[0] });
            } else {
                alert("인접 자치구가 없습니다.");
            }
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>🎯 문화행사 추천</h2>

            {loading ? (
                <p>🔄 불러오는 중...</p>
            ) : events.length > 0 ? (
                <ul>
                    {events.map((event, idx) => (
                        <li key={idx}>
                            <strong>{event.TITLE}</strong> ({event.GUNAME})<br />
                            날짜: {event.DATE || `${event.STRTDATE} ~ ${event.END_DATE}`}<br />
                            장소: {event.PLACE}
                        </li>
                    ))}
                </ul>
            ) : (
                <>
                    <p>🔍 조건에 맞는 행사가 없어요.</p>
                    <div
                        style={{
                            marginTop: "1rem",
                            background: "#f5f5f5",
                            padding: "1rem",
                            borderRadius: "10px",
                        }}
                    >
                        <h4>🔄 이런 방법은 어때요?</h4>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            <button onClick={() => handleAdjust("date")} style={btnStyle}>
                                📅 날짜 하루 미루기
                            </button>
                            <button onClick={() => handleAdjust("time")} style={btnStyle}>
                                ⏰ 시간 범위 넓히기
                            </button>
                            <button onClick={() => handleAdjust("location")} style={btnStyle}>
                                📍 인접 자치구로 확장
                            </button>
                        </div>
                    </div>

                    {fallbackEvents.length > 0 && (
                        <>
                            <h4 style={{ marginTop: "2rem" }}>📌 다른 지역의 비슷한 행사</h4>
                            <ul>
                                {fallbackEvents.map((e, i) => (
                                    <li key={i}>
                                        <strong>{e.TITLE}</strong> ({e.GUNAME})<br />
                                        날짜: {e.DATE || `${e.STRTDATE} ~ ${e.END_DATE}`}<br />
                                        장소: {e.PLACE}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

const btnStyle = {
    padding: "8px 16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    backgroundColor: "#edf2f7",
};

export default TestSeoulEventAPI;
