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
            <p>���ɻ�: {group.interests?.join(", ")}</p>
            <p>���� �Ͻ�: {group.date} {group.time}</p>
            <p>���: {group.location}</p>
        </div>
    );
}

export default MatchedGroupCard;
