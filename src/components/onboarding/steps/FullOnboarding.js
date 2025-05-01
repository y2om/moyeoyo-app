// src/components/onboarding/steps/FullOnboarding.js
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ——————————————————
// 옵션 데이터
// ——————————————————
const interestOptions = [
    { label: "🎬 영화", value: "영화" },
    { label: "🎧 음악", value: "음악" },
    { label: "📚 독서", value: "독서" },
    { label: "💪 운동", value: "운동" },
    { label: "🎮 게임", value: "게임" },
    { label: "✈️ 여행", value: "여행" },
    { label: "🍳 요리", value: "요리" },
    { label: "🤝 봉사", value: "봉사" },
    { label: "🧠 자기계발", value: "자기계발" },
    { label: "☕ 카페탐방", value: "카페탐방" },
    { label: "📸 사진", value: "사진" },
    { label: "🎲 보드게임", value: "보드게임" },
];
const personalityOptions = [
    "외향적", "내향적",
    "계획적인", "즉흥적인",
    "리더형", "서포터형"
];

// ——————————————————
// 토스 스타일 버튼
// ——————————————————
const TossButton = ({ children, onClick, disabled, style }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        style={{
            background: disabled ? "#E0E0E0" : "#1B1B1F",
            color: "#FFFFFF",
            border: "none",
            borderRadius: 28,
            padding: "12px 32px",
            fontSize: 16,
            fontWeight: 500,
            boxShadow: disabled ? "none" : "0 4px 8px rgba(0,0,0,0.1)",
            cursor: disabled ? "not-allowed" : "pointer",
            transition: "background 0.2s",
            width: "100%",
            marginTop: 24,
            ...style,
        }}
    >
        {children}
    </button>
);

export default function FullOnboarding({ formData, setFormData, onNext }) {
    const [step, setStep] = useState("gender");
    const [localInterests, setLocalInterests] = useState(formData.interests || []);
    const [dt, setDt] = useState("");
    const locationRef = useRef();

    const order = ["gender", "age", "interest", "personality", "time", "location"];
    const idx = order.indexOf(step);

    const next = () => {
        if (idx < order.length - 1) {
            setStep(order[idx + 1]);
        }
    };
    const back = () => {
        if (idx > 0) setStep(order[idx - 1]);
    };

    // 단일 선택
    const selectGender = g => {
        setFormData({ ...formData, gender: g });
        setTimeout(next, 200);
    };
    const selectAge = a => {
        setFormData({ ...formData, ageGroup: a });
        setTimeout(next, 200);
    };
    const selectPersonality = p => {
        setFormData({ ...formData, personality: p });
        setTimeout(next, 200);
    };

    // 다중 선택
    const toggleInterest = v => {
        const updated = localInterests.includes(v)
            ? localInterests.filter(x => x !== v)
            : [...localInterests, v];
        setLocalInterests(updated);
        setFormData({ ...formData, interests: updated });
    };

    // 날짜·시간 추가
    const addDateTime = () => {
        if (!dt) {
            return alert("날짜와 시간을 선택해 주세요.");
        }
        const picked = new Date(dt);
        const now = new Date();
        if (picked < now) {
            return alert("현재 이후의 날짜·시간을 선택해 주세요.");
        }
        const updated = [...(formData.availableTimes || []), { datetime: dt }];
        setFormData({ ...formData, availableTimes: updated });
        setDt("");
    };

    // 위치 최종 제출 (OnboardingController 의 onNext 호출)
    const submitLocation = async () => {
        const addr = locationRef.current.value.trim();
        if (!addr) return alert("주소를 입력해 주세요.");
        const res = await fetch(
            `https://dapi.kakao.com/v2/local/search/address.json?query=${encodeURIComponent(addr)}`,
            { headers: { Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_API_KEY}` } }
        );
        const { documents } = await res.json();
        if (!documents.length) return alert("주소를 찾을 수 없습니다.");
        const { x: lng, y: lat } = documents[0];
        setFormData({
            ...formData,
            location: { latitude: parseFloat(lat), longitude: parseFloat(lng) }
        });
        onNext();
    };

    const needsNextBtn = !["gender", "age", "location"].includes(step);
    const canNext = () => {
        switch (step) {
            case "interest": return localInterests.length > 0;
            case "time": return (formData.availableTimes || []).length > 0;
            default: return false;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ padding: 24, maxWidth: 600, margin: "0 auto", position: "relative" }}
        >
            {step !== "gender" && (
                <button onClick={back}
                    style={{
                        position: "absolute", top: 16, left: 16,
                        fontSize: 24, background: "none", border: "none", cursor: "pointer"
                    }}
                >
                    ←
                </button>
            )}

            <AnimatePresence mode="wait">
                {step === "gender" && (
                    <motion.div key="gender"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}
                        style={{ textAlign: "center", gap: 16 }}
                    >
                        <h2 style={{ color: "#1B1B1F" }}>🎈 안녕하세요! 어떻게 부를까요?</h2>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            <TossButton onClick={() => selectGender("남성")}>👨 남성</TossButton>
                            <TossButton onClick={() => selectGender("여성")}>👩 여성</TossButton>
                        </div>
                    </motion.div>
                )}

                {step === "age" && (
                    <motion.div key="age"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}
                        style={{ textAlign: "center", gap: 16 }}
                    >
                        <h2 style={{ color: "#1B1B1F" }}>✨ 나이대를 알려 주세요</h2>
                        <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
                            {["20대", "30대"].map(a => (
                                <TossButton key={a} onClick={() => selectAge(a)}>{a}</TossButton>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === "interest" && (
                    <motion.div /* ... */>
                        <h2>✨ 관심사를 골라 주세요</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                            {interestOptions.map(opt => (
                                <TossButton
                                    key={opt.value}
                                    onClick={() => toggleInterest(opt.value)}
                                    disabled={false}
                                    style={{
                                        background: localInterests.includes(opt.value) ? "#007AFF" : "#1B1B1F",
                                        padding: "8px 16px",   // ← 패딩 작게
                                        fontSize: 14,          // ← 폰트 작게
                                        borderRadius: 20,      // ← 좀 더 동그랗게
                                        boxShadow: "none",     // ← 그림자 제거
                                        width: "auto"          // ← 너비 자동
                                    }}
                                >
                                    {opt.label}
                                </TossButton>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === "personality" && (
                    <motion.div /* ... */>
                        <h2>✨ 나를 나타내는 단어</h2>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
                            {personalityOptions.map(p => (
                                <TossButton
                                    key={p}
                                    onClick={() => selectPersonality(p)}
                                    style={{
                                        background: formData.personality === p ? "#007AFF" : "#1B1B1F",
                                        padding: "8px 16px",   // ← 패딩 작게
                                        fontSize: 14,          // ← 폰트 작게
                                        borderRadius: 20,
                                        boxShadow: "none",
                                        width: "auto"
                                    }}
                                >
                                    {p}
                                </TossButton>
                            ))}
                        </div>
                    </motion.div>
                )}

                {step === "time" && (
                    <motion.div key="time"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}
                        style={{ textAlign: "center", gap: 16 }}
                    >
                        <h2 style={{ color: "#1B1B1F" }}>⏰ 함께할 날짜·시간 선택</h2>
                        <input
                            type="datetime-local"
                            value={dt}
                            onChange={e => setDt(e.target.value)}
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc" }}
                        />
                        <TossButton onClick={addDateTime} disabled={!dt}>➕ 추가</TossButton>
                        <ul style={{ marginTop: 12, paddingLeft: 20, textAlign: "left" }}>
                            {(formData.availableTimes || []).map((t, i) => (
                                <li key={i}>📅 {new Date(t.datetime).toLocaleString()}</li>
                            ))}
                        </ul>
                    </motion.div>
                )}

                {step === "location" && (
                    <motion.div key="location"
                        initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -20, opacity: 0 }} transition={{ duration: 0.3 }}
                        style={{ textAlign: "center", gap: 16 }}
                    >
                        <h2 style={{ color: "#1B1B1F" }}>📍 어디에서 만날까요?</h2>
                        <input
                            type="text"
                            ref={locationRef}
                            placeholder="도로명 주소 입력"
                            style={{ padding: 8, borderRadius: 8, border: "1px solid #ccc", width: "80%" }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* gender, age 스텝에도 Next 버튼 안 보이게, location 스텝에도 숨김 */}
            {needsNextBtn && (
                <TossButton
                    onClick={next}
                    disabled={!canNext()}
                >
                    다음
                </TossButton>
            )}
        </motion.div>
    );
}
