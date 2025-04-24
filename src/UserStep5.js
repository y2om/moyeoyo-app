import React, { useState } from "react";

const guList = [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구",
    "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구",
    "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
    "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
];

const UserStep5 = ({ onNext, setFormData }) => {
    const [selectedGu, setSelectedGu] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedGu) {
            alert("사는 지역을 선택해주세요!");
            return;
        }
        setFormData((prev) => ({ ...prev, location: selectedGu }));

        // ✅ 여기서 onNext 또는 onSave를 호출 (onSubmit ❌)
        if (onNext) onNext();
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: "500px", margin: "2rem auto", textAlign: "center" }}>
            <h2 style={{ marginBottom: "1rem" }}>📍 서울 어디쯤 사시나요?</h2>
            <p style={{ color: "#666", marginBottom: "2rem" }}>
                가까운 지역의 분들과 자연스럽게 만날 수 있도록 도와드릴게요 🙌
            </p>

            <select
                value={selectedGu}
                onChange={(e) => setSelectedGu(e.target.value)}
                style={{
                    padding: "12px 16px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "1px solid #ccc",
                    width: "100%",
                    marginBottom: "2rem"
                }}
            >
                <option value="">서울시 자치구 선택</option>
                {guList.map((gu) => (
                    <option key={gu} value={gu}>{gu}</option>
                ))}
            </select>

            <button
                type="submit"
                style={{
                    backgroundColor: "#2b6cb0",
                    color: "white",
                    padding: "10px 20px",
                    fontSize: "16px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer"
                }}
            >
                저장하고 시작하기
            </button>
        </form>
    );
};

export default UserStep5;
