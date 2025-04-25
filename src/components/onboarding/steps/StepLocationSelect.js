import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const guList = [
    "강남구", "강동구", "강북구", "강서구", "관악구", "광진구",
    "구로구", "금천구", "노원구", "도봉구", "동대문구", "동작구",
    "마포구", "서대문구", "서초구", "성동구", "성북구", "송파구",
    "양천구", "영등포구", "용산구", "은평구", "종로구", "중구", "중랑구"
];

function StepLocationSelect({ onNext, setFormData }) {
    const [selectedGu, setSelectedGu] = useState("");
    const [isSubmitted, setIsSubmitted] = useState(false);

    // ✅ location이 설정되고 나면 다음 단계로 이동
    useEffect(() => {
        if (isSubmitted && selectedGu) {
            if (onNext) onNext();
        }
    }, [isSubmitted, selectedGu, onNext]);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedGu) {
            alert("사는 지역을 선택해주세요!");
            return;
        }

        console.log("✅ 선택된 지역:", selectedGu);

        setFormData((prev) => {
            const updated = { ...prev, location: selectedGu };
            console.log("🧾 업데이트할 formData.location:", updated.location);
            return updated;
        });

        setIsSubmitted(true); // 👉 location 업데이트 완료되었음을 표시
    };

    return (
        <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            style={formStyle}
        >
            <motion.h2 style={headingStyle}>
                📍 서울 어디쯤 사시나요?
            </motion.h2>
            <p style={subTextStyle}>
                가까운 지역의 분들과 자연스럽게 만날 수 있도록 도와드릴게요 🙌
            </p>

            <select
                value={selectedGu}
                onChange={(e) => setSelectedGu(e.target.value)}
                style={selectStyle}
            >
                <option value="">서울시 자치구 선택</option>
                {guList.map((gu) => (
                    <option key={gu} value={gu}>
                        {gu}
                    </option>
                ))}
            </select>

            <button type="submit" style={buttonStyle}>
                시작하기
            </button>
        </motion.form>
    );
}

const formStyle = {
    maxWidth: "500px",
    margin: "2rem auto",
    padding: "1.5rem",
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
};

const headingStyle = {
    fontSize: "1.6rem",
    lineHeight: "2.2rem",
};

const subTextStyle = {
    fontSize: "1rem",
    color: "#666",
    marginTop: "-10px",
};

const selectStyle = {
    padding: "12px 16px",
    fontSize: "1rem",
    borderRadius: "10px",
    border: "1px solid #ccc",
    width: "100%",
};

const buttonStyle = {
    marginTop: "1rem",
    backgroundColor: "#2b6cb0",
    color: "white",
    padding: "14px 32px",
    fontSize: "1.1rem",
    fontWeight: "500",
    borderRadius: "16px",
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
};

export default StepLocationSelect;
