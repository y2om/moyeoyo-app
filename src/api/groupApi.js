// src/groupApi.js
import axios from "axios";

// ngrok 터널 URL을 .env로 관리하거나 기본값을 설정
const BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://9a37-1-231-153-62.ngrok-free.app";

/**
 * Firestore에서 groups 컬렉션을 조회합니다.
 * @param {string} status - (선택) 상태 필터
 * @returns {Promise<Array<Object>>}
 */




export async function fetchGroups(status = "") {
    try {
        const res = await axios.get(
            '${BASE_URL}/api/groups',
            {
                params: status ? { status } : {},
                headers: { "ngrok-skip-browser-warning": "1" }
            }
        );
        return res.data;
    } catch (err) {
        console.error("그룹 목록 가져오기 실패:", err);
        return [];
    }
}

/**
 * 주어진 userId를 기준으로 그룹 매칭 결과를 가져옵니다.
 * @param {string} userId
 * @returns {Promise<Array<Object>>}
 */
export async function matchGroups(userId) {
    try {
        const res = await axios.post(
            `${BASE_URL}/api/group/match`,
            { user_id: userId },
            {
                headers: {
                    "Content-Type": "application/json",
                    "ngrok-skip-browser-warning": "1"
                }
            }
        );
        return res.data;
    } catch (err) {
        console.error("그룹 매칭 실패:", err);
        return [];
    }
}
