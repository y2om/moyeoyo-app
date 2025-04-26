import React from "react";

function MatchedGroupCard({ group }) {
    return (
        <div style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            padding: "16px",
            marginBottom: "10px"
        }}>
            <h3>{group.name}</h3>
            <p>관심사: {group.interests?.join(", ")}</p>
            <p>모임 일시: {group.date} {group.time}</p>
            <p>장소: {group.location}</p>
        </div>
    );
}

export default MatchedGroupCard;
