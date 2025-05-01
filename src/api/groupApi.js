// ngrok 서버에서 그룹 리스트 가져오기
import axios from "axios";

const BASE_URL = "https://92ab-1-231-153-62.ngrok-free.app";

export async function fetchGroups(status = "") {
    try {
        const url = status ? `${BASE_URL}/groups?status=${status}` : `${BASE_URL}/api/groups`;
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error("그룹 목록 가져오기 실패:", error);
        return [];
    }
}
