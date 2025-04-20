// matchRequest.js

export const sendMatchRequest = async (userData) => {
    try {
        const response = await fetch("/match", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userData),
        });

        if (!response.ok) {
            throw new Error("매칭 요청 실패");
        }

        const result = await response.json();
        console.log("🎯 매칭 결과:", result);

        // 매칭 결과를 Firestore에 저장 (예: matchingResults 컬렉션)
        const { doc, setDoc } = await import("firebase/firestore");
        const { db } = await import("./firebase");

        const groupId = result.groupId || Math.random().toString(36).substring(2, 10);

        await setDoc(doc(db, "matchingResults", groupId), {
            groupId,
            members: result.members,
            commonInterests: result.commonInterests,
            matchedAt: new Date(),
        });

        return result;
    } catch (error) {
        console.error("❌ 매칭 요청 오류:", error);
        return null;
    }
};

// 예시 사용 방식:
// import { sendMatchRequest } from './matchRequest';
// const userInput = {
//   interests: ["운동", "음악"],
//   traits: ["조용한 분위기를 선호해요", "따라가는 게 편해요"],
//   ageGroup: "20대",
//   gender: "여자",
//   availableTimes: [
//     { date: "2024-05-05", timeRange: "14:00 ~ 16:00" }
//   ],
//   location: "마포구"
// };
// sendMatchRequest(userInput);
