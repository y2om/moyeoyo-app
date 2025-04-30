import React, { useEffect, useState } from "react";
import axios from "axios";

// 필요 시 .env로 분리 가능
const BASE_URL = "https://85bb-1-231-153-62.ngrok-free.app"; // 예: https://abcd-12-34-56-78.ngrok-free.app

function MatchPage() {
    const [groups, setGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/api/groups`);
                if (Array.isArray(res.data)) {
                    setGroups(res.data);
                } else {
                    console.error("❗예상과 다른 응답 구조:", res.data);
                    setGroups([]);
                }
            } catch (error) {
                console.error("⚠️ 그룹 데이터를 불러오는 데 실패했습니다:", error);
                setGroups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchGroups();
    }, []);

    if (loading) return <p>로딩 중...</p>;

    return (
        <div style={containerStyle}>
            <h2>📦 매칭된 그룹 목록</h2>
            {groups.length === 0 ? (
                <p>현재 매칭된 그룹이 없습니다.</p>
            ) : (
                groups.map((group, idx) => (
                    <div key={idx} style={cardStyle}>
                        <p><strong>그룹 ID:</strong> {group.group_id}</p>
                        <p><strong>참여자:</strong> {group.user_ids?.join(", ")}</p>
                        <p><strong>공통 관심사:</strong> {group.matched_interest}</p>
                        <p><strong>공통 가능한 날짜:</strong> {group.matched_date}</p>
                        <p><strong>상태:</strong> {group.status}</p>
                        <p><strong>생성일시:</strong> {group.created_at}</p>
                    </div>
                ))
            )}
        </div>
    );
}

export default MatchPage;

// 💅 간단한 인라인 스타일
const containerStyle = {
    padding: "2rem",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
};

const cardStyle = {
    border: "1px solid #ccc",
    borderRadius: "12px",
    padding: "1rem",
    marginBottom: "1rem",
    backgroundColor: "#f9f9f9",
};
