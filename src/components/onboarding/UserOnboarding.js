import React from "react"; // React import
import OnboardingController from "./OnboardingController"; // 핵심 로직 포함된 컨트롤러 import

// props로 user와 onComplete를 받아서 컨트롤러에 넘겨줌
function UserOnboarding({ user, onComplete }) {
    return <OnboardingController user={user} onComplete={onComplete} />;
}

export default UserOnboarding; // 외부에서 사용할 수 있도록 export
