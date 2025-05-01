// src/pages/MatchPage.js
import React, { useEffect, useState } from "react";
import styles from "./MatchPage.module.css";

const BASE_URL =
    process.env.NODE_ENV === "development"
        ? "http://localhost:5000"
        : process.env.REACT_APP_API_BASE_URL;

export default function MatchPage() {
    const [groups, setGroups] = useState([]);
    const [matched, setMatched] = useState([]);
    const [user, setUser] = useState(null);

    // 1) 로컬스토리지에서 로그인 정보 꺼내기
    useEffect(() => {
        const stored = localStorage.getItem("user");
        if (stored) {
            try {
                setUser(JSON.parse(stored));
            } catch {
                setUser(null);
            }
        }
    }, []);

    // 2) 생성된 그룹 목록 불러오기
    useEffect(() => {
        fetch(`${BASE_URL}/api/groups`, {
            headers: { "ngrok-skip-browser-warning": "1" },
        })
            .then(res => {
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return res.json();
            })
            .then(data => setGroups(Array.isArray(data) ? data : []))
            .catch(err => {
                console.error("그룹 목록 조회 실패:", err);
                setGroups([]);
            });
    }, []);

    // 3) 매칭 요청
    const handleMatch = async () => {
        if (!user?.email) {
            alert("로그인 후 시도하세요.");
            return;
        }

        console.log("▶ 매칭 요청 user_id:", user.email);

        try {
            const res = await fetch(`${BASE_URL}/api/group/match`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "1",
                },
                body: JSON.stringify({ user_id: user.email }),
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => ({}));
                console.error("매칭 API 에러:", res.status, errBody);
                setMatched([]);
                return;
            }

            const result = await res.json();
            setMatched(Array.isArray(result) ? result : []);
        } catch (err) {
            console.error("그룹 매칭 실패:", err);
            setMatched([]);
        }
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.title}>마주침 • 그룹 매칭</h1>
            </header>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>생성된 그룹</h2>
                <div className={styles.cardContainer}>
                    {groups.length === 0 ? (
                        <div className={styles.emptyState}>
                            아직 생성된 그룹이 없습니다.
                        </div>
                    ) : (
                        groups.map((g, i) => (
                            <div key={i} className={styles.groupCard}>
                                <div className={styles.groupField}>
                                    <span className={styles.fieldLabel}>날짜</span>
                                    <span className={styles.fieldValue}>
                                        {g.matched_date}
                                    </span>
                                </div>
                                <div className={styles.groupField}>
                                    <span className={styles.fieldLabel}>관심사</span>
                                    <span className={styles.fieldValue}>
                                        {g.matched_interest}
                                    </span>
                                </div>
                                <div className={styles.groupField}>
                                    <span className={styles.fieldLabel}>참여자</span>
                                    <span className={styles.fieldValue}>
                                        {g.user_ids.join(", ")}
                                    </span>
                                </div>
                                <div className={styles.groupStatus}>{g.status}</div>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className={styles.section}>
                <h2 className={styles.subtitle}>그룹 매칭 테스트</h2>
                <div className={styles.matchCard}>
                    <input
                        type="text"
                        readOnly
                        value={user?.email || ""}
                        placeholder="로그인 후 자동 입력"
                        className={styles.input}
                    />
                    <button onClick={handleMatch} className={styles.button}>
                        내 주변으로 매칭
                    </button>
                </div>

                <div className={styles.resultContainer}>
                    {matched.length === 0 ? (
                        <div className={styles.emptyState}>매칭된 그룹이 없습니다.</div>
                    ) : (
                        matched.map((g, i) => (
                            <div key={i} className={styles.groupCard}>
                                <div className={styles.groupField}>
                                    <span className={styles.fieldLabel}>날짜</span>
                                    <span className={styles.fieldValue}>
                                        {g.matched_date}
                                    </span>
                                </div>
                                <div className={styles.groupField}>
                                    <span className={styles.fieldLabel}>관심사</span>
                                    <span className={styles.fieldValue}>
                                        {g.matched_interest}
                                    </span>
                                </div>
                                <div className={styles.groupField}>
                                    <span className={styles.fieldLabel}>참여자</span>
                                    <span className={styles.fieldValue}>
                                        {g.user_ids.join(", ")}
                                    </span>
                                </div>
                                <div className={styles.groupStatus}>{g.status}</div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </div>
    );
}
