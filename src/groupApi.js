import axios from "axios";

const BASE_URL =
    process.env.REACT_APP_API_BASE_URL ||
    "https://844d-1-231-153-62.ngrok-free.app";

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
                    // ngrok 무료 티어 경고 스킵이 필요하면 아래 헤더도 추가
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
