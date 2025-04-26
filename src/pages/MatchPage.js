import React from "react";
import GroupMatcher from "../components/GroupMatcher";

function MatchPage() {
    const userId = "현재_로그인된_사용자_ID"; // 이건 실제 로그인 연결해서 가져오게 수정할 것

    return (
        <div>
            <h2>🎯 나에게 맞는 그룹 추천</h2>
            <GroupMatcher userId={userId} />
        </div>
    );
}

export default MatchPage;
