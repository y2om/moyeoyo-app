import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";

const AdminPage = ({ user }) => {
    const [view, setView] = useState("users");
    const [users, setUsers] = useState([]);
    const [matchedGroups, setMatchedGroups] = useState([]);
    const [message, setMessage] = useState("");

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

    const insertSampleUsers = async () => {
        const samples = [ /* 생략된 유저 6명 */];

        try {
            for (const sample of samples) {
                await setDoc(doc(db, "users", sample.email), sample);
            }
            setMessage("✅ 샘플 사용자 6명 등록 완료!");
        } catch (error) {
            console.error("❌ 사용자 등록 실패:", error);
            setMessage("❌ 등록 중 오류 발생");
        }
    };

    if (!isAdmin) {
        return <p style={{ padding: "2rem", color: "crimson" }}>⛔ 접근 권한이 없습니다.</p>;
    }

    const getCommonItems = (users, key) => {
        const all = users.map((u) => u[key] || []);
        return all.reduce((a, b) => a.filter((v) => b.includes(v)), all[0] || []);
    };

    const getCommonDate = (users) => {
        const allDates = users.flatMap((u) => u.availableTimes?.map((t) => t.date) || []);
        return allDates.find((date) => allDates.filter((d) => d === date).length === users.length);
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 관리자 페이지</h2>

            <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <button onClick={() => setView("users")}>👥 사용자 목록</button>
                <button onClick={() => setView("groups")}>🔗 매칭 그룹</button>
            </div>

            <button
                onClick={insertSampleUsers}
                style={{
                    marginBottom: "1rem",
                    backgroundColor: "#90cdf4",
                    padding: "10px 16px",
                    border: "none",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    cursor: "pointer",
                    color: "white"
                }}
            >
                샘플 유저 6명 자동 등록
            </button>

            {message && <p style={{ marginBottom: "1rem", color: "#2b6cb0" }}>{message}</p>}

            {view === "users" && (
                <div>
                    <h3>👥 사용자 목록</h3>
                    {users.map((user, idx) => (
                        <div key={idx} style={styles.card}>
                            <p><strong>닉네임:</strong> {user.nickname || "없음"}</p>
                            <p><strong>이메일:</strong> {user.email}</p>
                            <p><strong>성별:</strong> {user.gender || "없음"}</p>
                            <p><strong>나이대:</strong> {user.ageGroup || "없음"}</p>
                            <p><strong>위치:</strong> {user.location || user.gu || "없음"}</p>
                            <p><strong>관심사:</strong> {Array.isArray(user.interests) ? user.interests.join(", ") : user.interests || "없음"}</p>
                            <p><strong>성향:</strong> {Array.isArray(user.personality) ? user.personality.join(", ") : user.personality || "없음"}</p>
                            <p><strong>가능 시간:</strong></p>
                            <ul>
                                {user.availableTimes?.length > 0
                                    ? user.availableTimes.map((t, i) => (
                                        <li key={i}>📅 {t.date} | ⏰ {t.timeRange}</li>
                                    ))
                                    : <li>없음</li>}
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
                        matchedGroups.map((group, i) => {
                            const commonInterests = getCommonItems(group.users, "interests");
                            const commonDate = getCommonDate(group.users);

                            return (
                                <div key={i} style={styles.groupCard}>
                                    <p><strong>그룹 {i + 1}</strong></p>
                                    <ul>
                                        {group.users?.map((u, idx) => (
                                            <li key={idx}>{u.nickname || u.email}</li>
                                        ))}
                                    </ul>
                                    <p><strong>공통 관심사:</strong> {commonInterests.join(", ") || "없음"}</p>
                                    <p><strong>공통 날짜:</strong> {commonDate || "없음"}</p>
                                </div>
                            );
                        })
                    )}
                </div>
            )}
        </div>
    );
};

const styles = {
    card: {
        background: "#f9f9f9",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem"
    },
    groupCard: {
        background: "#f0f4f8",
        padding: "1rem",
        borderRadius: "8px",
        marginBottom: "1rem"
    }
};

export default AdminPage;
