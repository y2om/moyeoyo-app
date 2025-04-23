import React, { useEffect, useState } from "react";
import { collection, getDocs, setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

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
        const samples = [
            {
                nickname: "홍길동",
                email: "test1@example.com",
                interests: ["음악", "요리", "산책"],
                availableTimes: [{ date: "2024-05-12", timeRange: "10:00 ~ 18:00" }],
                gender: "남자",
                ageGroup: "20대",
                location: "강남구",
                personality: ["차분한", "내향적"],
                updatedAt: serverTimestamp()
            },
            {
                nickname: "김하나",
                email: "test2@example.com",
                interests: ["음악", "게임", "산책"],
                availableTimes: [{ date: "2024-05-12", timeRange: "10:00 ~ 19:00" }],
                gender: "여자",
                ageGroup: "20대",
                location: "강남구",
                personality: ["외향적", "유쾌한"],
                updatedAt: serverTimestamp()
            },
            {
                nickname: "이재호",
                email: "test3@example.com",
                interests: ["요리", "게임", "영화"],
                availableTimes: [{ date: "2024-05-12", timeRange: "09:00 ~ 17:00" }],
                gender: "남자",
                ageGroup: "30대",
                location: "강남구",
                personality: ["열정적인", "차분한"],
                updatedAt: serverTimestamp()
            },
            {
                nickname: "박소은",
                email: "test4@example.com",
                interests: ["산책", "요리", "드로잉"],
                availableTimes: [{ date: "2024-05-12", timeRange: "11:00 ~ 17:00" }],
                gender: "여자",
                ageGroup: "20대",
                location: "강남구",
                personality: ["조용한", "내향적"],
                updatedAt: serverTimestamp()
            },
            {
                nickname: "정우성",
                email: "test5@example.com",
                interests: ["요리", "음악", "운동"],
                availableTimes: [{ date: "2024-05-12", timeRange: "10:30 ~ 18:00" }],
                gender: "남자",
                ageGroup: "30대",
                location: "강남구",
                personality: ["활발한", "외향적"],
                updatedAt: serverTimestamp()
            },
            {
                nickname: "최지현",
                email: "test6@example.com",
                interests: ["드로잉", "음악", "게임"],
                availableTimes: [{ date: "2024-05-12", timeRange: "09:30 ~ 18:30" }],
                gender: "여자",
                ageGroup: "20대",
                location: "강남구",
                personality: ["밝은", "상냥한"],
                updatedAt: serverTimestamp()
            }
        ];

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

    const getCommonItems = (lists, key) => {
        const allItems = lists.map((u) => u[key] || []);
        return allItems.reduce((a, b) => a.filter((i) => b.includes(i)), allItems[0] || []);
    };

    const getCommonDate = (users) => {
        const dates = users.map((u) => u.availableTimes?.map((t) => t.date)).flat();
        return dates?.filter((date, _, arr) => arr.filter((d) => d === date).length === users.length)[0];
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
                        <div
                            key={idx}
                            style={{
                                background: "#f9f9f9",
                                padding: "1rem",
                                borderRadius: "8px",
                                marginBottom: "1rem"
                            }}
                        >
                            <p><strong>닉네임:</strong> {user.nickname || "없음"}</p>
                            <p><strong>이메일:</strong> {user.email}</p>
                            <p><strong>성별:</strong> {user.gender || "없음"}</p>
                            <p><strong>나이대:</strong> {user.ageGroup || "없음"}</p>
                            <p><strong>위치:</strong> {user.location || user.gu || "없음"}</p>
                            <p><strong>관심사:</strong> {user.interests?.join(", ") || "없음"}</p>
                            <p><strong>성향:</strong> {user.personality?.join(", ") || "없음"}</p>
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
                        matchedGroups.map((group, i) => {
                            const commonInterests = getCommonItems(group.users, "interests");
                            const commonDate = getCommonDate(group.users);
                            return (
                                <div
                                    key={i}
                                    style={{
                                        background: "#f0f4f8",
                                        padding: "1rem",
                                        borderRadius: "8px",
                                        marginBottom: "1rem"
                                    }}
                                >
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

export default AdminPage;
