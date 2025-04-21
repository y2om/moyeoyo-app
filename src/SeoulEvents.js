import React, { useEffect, useState } from "react";

const SeoulEvents = () => {
    const [events, setEvents] = useState([]);
    const API_KEY = "4557567a517962683130396479775446";

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch(
                    `http://openapi.seoul.go.kr:8088/${API_KEY}/json/culturalEventInfo/1/20/`
                );
                const data = await response.json();

                const rows = data?.culturalEventInfo?.row;
                if (rows) {
                    setEvents(rows);
                } else {
                    console.error("데이터 형식이 예상과 다릅니다:", data);
                }
            } catch (error) {
                console.error("문화행사 데이터를 불러오는 데 실패했습니다:", error);
            }
        };

        fetchEvents();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>🎭 서울시 문화행사 목록</h2>
            {events.length === 0 ? (
                <p>불러오는 중...</p>
            ) : (
                <ul>
                    {events.map((event, idx) => (
                        <li key={idx} style={{ marginBottom: "1rem" }}>
                            <strong>{event.TITLE}</strong> ({event.GUNAME})<br />
                            날짜: {event.DATE}<br />
                            장소: {event.PLACE}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SeoulEvents;
