import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { v4 as uuidv4 } from "uuid";

const AdminPage = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [matchingGroups, setMatchingGroups] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user || user.email !== "ybhss1418@naver.com") return;
        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(userList);
            setLoading(false);
        };
        fetchUsers();
    }, [user]);

    const handleAutoMatch = () => {
        const matches = [];
        const used = new Set();

        for (let i = 0; i < users.length; i++) {
            const group = [users[i]];
            if (used.has(users[i].email)) continue;

            for (let j = i + 1; j < users.length; j++) {
                if (used.has(users[j].email)) continue;

                const sharedInterests = users[i].interests?.filter(item => users[j].interests?.includes(item));
                const timeOverlap = users[i].availableTimes?.some(t1 =>
                    users[j].availableTimes?.some(t2 => t1.timeRange === t2.timeRange)
                );

                if (sharedInterests?.length > 0 && timeOverlap) {
                    group.push(users[j]);
                }

                if (group.length >= 3) break;
            }

            if (group.length >= 2) {
                group.forEach(u => used.add(u.email));
                matches.push({
                    id: uuidv4(),
                    members: group.map(u => u.email),
                    commonInterests: group.reduce((acc, cur) =>
                        acc.filter(item => cur.interests?.includes(item))
                        , group[0].interests || []),
                    timeRange: group[0].availableTimes?.[0]?.timeRange || "",
                });
            }
        }

        setMatchingGroups(matches);
        matches.forEach(async (match) => {
            await setDoc(doc(db, "matchingGroups", match.id), match);
        });
        alert("✅ 자동 매칭이 완료되었습니다!");
    };

    if (!user || user.email !== "ybhss1418@naver.com") {
        return <p style={{ padding: "2rem" }}>🚫 관리자만 접근할 수 있습니다.</p>;
    }

    if (loading) return <p>⏳ 사용자 정보를 불러오는 중입니다...</p>;

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 관리자 페이지 - 사용자 목록</h2>

            <button
                onClick={handleAutoMatch}
                style={{
                    marginBottom: "20px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                }}
            >
                🔄 자동 매칭 실행
            </button>

            {matchingGroups.length > 0 && (
                <div style={{ marginBottom: "2rem" }}>
                    <h3>🔗 매칭된 그룹 ({matchingGroups.length}개)</h3>
                    {matchingGroups.map((group, idx) => (
                        <div key={group.id} style={{ padding: "10px", border: "1px solid #ccc", marginTop: "10px" }}>
                            <strong>그룹 {idx + 1}:</strong>
                            <p>👥 {group.members.join(", ")}</p>
                            <p>🎯 공통 관심사: {group.commonInterests.join(", ")}</p>
                            <p>⏰ 시간대: {group.timeRange}</p>
                        </div>
                    ))}
                </div>
            )}

            {users.length === 0 ? (
                <p>🙁 등록된 사용자가 없습니다.</p>
            ) : (
                users.map(user => (
                    <div
                        key={user.id}
                        style={{
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            padding: "1rem",
                            marginBottom: "1rem",
                            backgroundColor: "#f9f9f9"
                        }}
                    >
                        <h3>👤 {user.nickname || "닉네임 없음"}</h3>
                        <p><strong>이메일:</strong> {user.email}</p>
                        <p><strong>성별:</strong> {user.gender || "미입력"}</p>
                        <p><strong>나이대:</strong> {user.ageGroup || "미입력"}</p>
                        <p><strong>관심사:</strong> {user.interests?.join(", ") || "없음"}</p>
                        <p><strong>가능 시간:</strong></p>
                        <ul>
                            {(user.availableTimes || []).map((time, idx) => (
                                <li key={idx}>
                                    📅 {time.date} | ⏰ {time.timeRange}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default AdminPage;
