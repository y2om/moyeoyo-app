import { useState } from "react";

export default function SignupForm() {
    const [form, setForm] = useState({
        nickname: "",
        ageGroup: "",
        interests: [],
        timeSlots: [],
    });

    const interestsList = ["영화", "운동", "독서", "여행", "음악", "게임"];
    const timeSlotOptions = ["오전", "오후", "저녁"];

    const handleChange = (key, value) => {
        setForm({ ...form, [key]: value });
    };

    const toggleListValue = (key, value) => {
        setForm({
            ...form,
            [key]: form[key].includes(value)
                ? form[key].filter((v) => v !== value)
                : [...form[key], value],
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("회원가입 정보:", form);
    };

    return (
        <div style={{ maxWidth: "500px", margin: "2rem auto" }}>
            <h2>회원가입</h2>
            <form onSubmit={handleSubmit}>
                <label>닉네임</label>
                <input
                    type="text"
                    value={form.nickname}
                    onChange={(e) => handleChange("nickname", e.target.value)}
                    required
                />

                <label>연령대</label>
                <div>
                    <button type="button" onClick={() => handleChange("ageGroup", "20대")}>
                        20대
                    </button>
                    <button type="button" onClick={() => handleChange("ageGroup", "30대")}>
                        30대
                    </button>
                </div>

                <label>관심사</label>
                <div>
                    {interestsList.map((item) => (
                        <button type="button" key={item} onClick={() => toggleListValue("interests", item)}>
                            {form.interests.includes(item) ? `✅ ${item}` : item}
                        </button>
                    ))}
                </div>

                <label>참여 가능한 시간대</label>
                <div>
                    {timeSlotOptions.map((time) => (
                        <button type="button" key={time} onClick={() => toggleListValue("timeSlots", time)}>
                            {form.timeSlots.includes(time) ? `✅ ${time}` : time}
                        </button>
                    ))}
                </div>

                <br />
                <button type="submit">가입하기</button>
            </form>
        </div>
    );
}
