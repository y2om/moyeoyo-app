import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const AdminPage = () => {
    const [matchingResults, setMatchingResults] = useState([]);
    const [userList, setUserList] = useState([]);
    const [selectedMenu, setSelectedMenu] = useState("users"); // "users" or "matches"

    useEffect(() => {
        const fetchMatchingResults = async () => {
            try {
                const snapshot = await getDocs(collection(db, "matchingResults"));
                const results = snapshot.docs.map(doc => doc.data());
                setMatchingResults(results);
            } catch (error) {
                console.error("❌ 매칭 결과 불러오기 실패:", error);
            }
        };

        const fetchUsers = async () => {
            try {
                const snapshot = await getDocs(collection(db, "users"));
                const users = snapshot.docs.map(doc => doc.data());
                setUserList(users);
            } catch (error) {
                console.error("❌ 사용자 목록 불러오기 실패:", error);
            }
        };

        fetchMatchingResults();
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📋 관리자 페이지</h2>

            <div style={{ marginBottom: "1.5rem" }}>
                <button
                    onClick={() => setSelectedMenu("users")}
                    style={{
                        marginRight: "10px",
                        padding: "8px 16px",
                        backgroundColor: selectedMenu === "users" ? "#3182ce" : "#e2e8f0",
                        color: selectedMenu === "users" ? "white" : "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    👥 사용자 목록
                </button>
                <button
                    onClick={() => setSelectedMenu("matches")}
                    style={{
                        padding: "8px 16px",
                        backgroundColor: selectedMenu === "matches" ? "#3182ce" : "#e2e8f0",
                        color: selectedMenu === "matches" ? "white" : "black",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                    }}
                >
                    🔗 매칭 그룹
                </button>
            </div>

            {selectedMenu === "users" && (
                <>
                    <h3>🧑‍🤝‍🧑 등록된 사용자 목록</h3>
                    {userList.length === 0 ? (
                        <p>⏳ 사용자 목록을 불러오는 중입니다...</p>
                    ) : (
                        userList.map((user, idx) => (
                            <div
                                key={user.email || idx}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    backgroundColor: "#f0f8ff",
                                }}
                            >
                                <p><strong>닉네임:</strong> {user.nickname || "(없음)"}</p>
                                <p><strong>이메일:</strong> {user.email}</p>
                                <p><strong>성별:</strong> {user.gender}</p>
                                <p><strong>나이대:</strong> {user.ageGroup}</p>
                                <p><strong>자치구:</strong> {user.location}</p>
                            </div>
                        ))
                    )}
                </>
            )}

            {selectedMenu === "matches" && (
                <>
                    <h3>🔗 매칭된 그룹 목록</h3>
                    {matchingResults.length === 0 ? (
                        <p>⏳ 아직 매칭된 그룹이 없습니다.</p>
                    ) : (
                        matchingResults.map((group, idx) => (
                            <div
                                key={group.groupId || idx}
                                style={{
                                    border: "1px solid #ccc",
                                    borderRadius: "8px",
                                    padding: "1rem",
                                    marginBottom: "1rem",
                                    backgroundColor: "#f9f9f9",
                                }}
                            >
                                <h3>그룹 {idx + 1}</h3>
                                <p><strong>공통 관심사:</strong> {group.commonInterests?.join(", ")}</p>
                                <p><strong>구성원:</strong></p>
                                <ul>
                                    {group.members?.map((email, i) => (
                                        <li key={i}>👤 {email}</li>
                                    ))}
                                </ul>
                                <p><strong>매칭 시각:</strong> {group.matchedAt?.toDate?.().toLocaleString?.() || String(group.matchedAt)}</p>
                            </div>
                        ))
                    )}
                </>
            )}
        </div>
    );
};

export default AdminPage;
