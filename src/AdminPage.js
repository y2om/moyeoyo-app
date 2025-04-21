import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const AdminPage = ({ user }) => {
    const [view, setView] = useState("users");
    const [users, setUsers] = useState([]);
    const [matchedGroups, setMatchedGroups] = useState([]);

    // ✅ 관리자 이메일 확인
    const adminEmails = ["ybhss1418@naver.com"];
    const isAdmin = adminEmails.includes(user?.email);

    useEffect(() => {
        if (!isAdmin) return;

        const fetchUsers = async () => {
            const snapshot = await getDocs(collection(db, "users"));
            const data = snapshot.docs.map((doc) => doc.data());
            setUsers(data);
        };

        const fetchGroups = async () => {
            const snapshot = await getDocs(collection(db, "matchedGroups"));
            const data = snapshot.docs.map((doc) => doc.data());
            setMatchedGroups(data);
        };

        fetchUsers();
        fetchGroups();
    }, [isAdmin]);

    if (!isAdmin) {
        return <p style={{ padding: "2rem", color: "crimson" }}>⛔ 접근 권한이 없습니다.</p>;
    }

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 관리자 페이지</h2>
            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={() => setView("users")}>👥 사용자 목록</button>
                <button onClick={() => setView("groups")}>🔗 매칭 그룹</button>
            </div>

            {view === "users" && (
                <div>
                    <h3>👥 사용자 목록</h3>
                    {users.map((user, idx) => (
                        <div key={idx} style={{ background: "#f9f9f9", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                            <p><strong>닉네임:</strong> {user.nickname || "없음"}</p>
                            <p><strong>이메일:</strong> {user.email}</p>
                            <p><strong>성별:</strong> {user.gender || "없음"}</p>
                            <p><strong>나이대:</strong> {user.ageGroup || "없음"}</p>
                            <p><strong>위치:</strong> {user.location || user.gu || "없음"}</p>
                            <p><strong>관심사:</strong> {user.interests?.join(", ") || "없음"}</p>
                            <p><strong>성향:</strong> {user.traits?.join(", ") || "없음"}</p>
                            <p><strong>가능 시간:</strong></p>
                            <ul>
                                {user.availableTimes?.map((t, i) => (
                                    <li key={i}>📅 {t.date} | ⏰ {t.timeRange}</li>
                                )) || <li>없음</li>}
                            </ul>
                        </div>
                    ))}
                </div>
            )}

            {view === "groups" && (
                <div>
                    <h3>🔗 매칭된 그룹 목록</h3>
                    {matchedGroups.length === 0 ? (
                        <p>⏳ 아직 매칭된 그룹이 없습니다.</p>
                    ) : (
                        matchedGroups.map((group, i) => (
                            <div key={i} style={{ background: "#f0f4f8", padding: "1rem", borderRadius: "8px", marginBottom: "1rem" }}>
                                <p><strong>그룹 {i + 1}</strong></p>
                                <ul>
                                    {group.users?.map((u, idx) => (
                                        <li key={idx}>{u.nickname || u.email}</li>
                                    ))}
                                </ul>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminPage;
