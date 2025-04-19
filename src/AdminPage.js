import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await getDocs(collection(db, "users"));
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
      setLoading(false);
    };
    fetchUsers();
  }, []);

  if (loading) return <p>⏳ 사용자 정보를 불러오는 중입니다...</p>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>📋 관리자 페이지 - 사용자 목록</h2>
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
