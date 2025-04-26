import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // firebase.js 사용
import { doc, getDoc } from "firebase/firestore";
import { fetchGroups } from "../api/groupApi";
import MatchedGroupCard from "./MatchedGroupCard";

function GroupMatcher({ userId }) {
    const [matchedGroups, setMatchedGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function matchUserToGroups() {
            setLoading(true);

            try {
                // 1. 사용자 정보 가져오기
                const userDoc = await getDoc(doc(db, "users", userId));
                const userData = userDoc.data();

                // 2. 그룹 리스트 가져오기
                const groups = await fetchGroups();

                if (!userData || groups.length === 0) {
                    setLoading(false);
                    return;
                }

                // 3. 매칭: 관심사 겹치는 그룹 찾기
                const matches = groups.filter(group => {
                    const commonInterests = group.interests?.filter(interest =>
                        userData.interests.includes(interest)
                    );
                    return commonInterests.length > 0;
                });

                setMatchedGroups(matches);
            } catch (error) {
                console.error("매칭 중 오류:", error);
            }

            setLoading(false);
        }

        matchUserToGroups();
    }, [userId]);

    if (loading) return <div>🔍 그룹을 찾고 있어요...</div>;
    if (matchedGroups.length === 0) return <div>😢 추천할 수 있는 그룹이 없어요.</div>;

    return (
        <div>
            {matchedGroups.map(group => (
                <MatchedGroupCard key={group.id} group={group} />
            ))}
        </div>
    );
}

export default GroupMatcher;
