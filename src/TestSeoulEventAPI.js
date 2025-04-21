import React, { useEffect, useState } from "react";

const TestSeoulEventAPI = ({ interests, selectedDate, selectedGu }) => {
    const [events, setEvents] = useState([]);
    const [fallbackEvents, setFallbackEvents] = useState([]);
    const API_KEY = "4557567a517962683130396479775446";

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/1/300/`
                );
                const data = await response.json();
                const rows = data?.culturalEventInfo?.row;

                if (rows) {
                    // 🎯 1차 필터링
                    const primaryFiltered = rows.filter((event) => {
                        const inGu = selectedGu ? event.GUNAME.includes(selectedGu) : true;
                        const inDate =
                            selectedDate &&
                            selectedDate >= event.STRTDATE &&
                            selectedDate <= event.END_DATE;

                        const matchesInterest = interests.some((interest) =>
                            (event.TITLE + event.PROGRAM + event.CODENAME).includes(interest)
                        );

                        return inGu && inDate && matchesInterest;
                    });

                    setEvents(primaryFiltered);

                    // 📌 2차: 같은 자치구의 다른 행사들 (중복 제거)
                    const sameDistrictEvents = rows.filter(
                        (event) =>
                            event.GUNAME === selectedGu &&
                            !primaryFiltered.find((e) => e.TITLE === event.TITLE)
                    );
                    setFallbackEvents(sameDistrictEvents);
                }
            } catch (error) {
                console.error("❌ API 호출 실패:", error);
            }
        };

        fetchEvents();
    }, [interests, selectedDate, selectedGu]);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>🎯 필터링된 문화행사 목록</h2>
            {events.length === 0 ? (
                <>
                    <p>🔍 조건에 맞는 행사가 없어요.</p>
                    {fallbackEvents.length > 0 && (
                        <>
                            <h3>📍 같은 지역({selectedGu})의 다른 행사들</h3>
                            <ul>
                                {fallbackEvents.map((event, idx) => (
                                    <li key={idx} style={{ marginBottom: "1rem" }}>
                                        <strong>{event.TITLE}</strong> ({event.GUNAME})<br />
                                        {event.DATE || `${event.STRTDATE} ~ ${event.END_DATE}`}<br />
                                        장소: {event.PLACE}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}
                </>
            ) : (
                <ul>
                    {events.map((event, idx) => (
                        <li key={idx} style={{ marginBottom: "1rem" }}>
                            <strong>{event.TITLE}</strong> ({event.GUNAME})<br />
                            {event.DATE || `${event.STRTDATE} ~ ${event.END_DATE}`}<br />
                            장소: {event.PLACE}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TestSeoulEventAPI;
