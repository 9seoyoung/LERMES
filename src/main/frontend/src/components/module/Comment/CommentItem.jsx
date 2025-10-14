import React, { useState, useEffect } from "react";
import { MessageCircle, MoreVertical } from "lucide-react";
import CommentInput from "./CommentInput";

export default function CommentItem({ comment, onAddReply, isReply = false }) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [hovering, setHovering] = useState(false); // 👈 hover 감지

  const handleReplySubmit = (replyText) => {
    onAddReply(comment.id, replyText);
    setShowReplyInput(false);
    setShowReplies(true);
  };

  const hasReplies = comment.replies && comment.replies.length > 0;

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: isReply ? "#f9fafb" : "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: "12px 16px",
        marginBottom: 10,
        marginLeft: isReply ? 28 : 0,
        boxShadow: isReply ? "none" : "0 1px 3px rgba(0,0,0,0.05)",
        transition: "background 0.2s",
      }}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => {
        setHovering(false);
        setShowMenu(false);
      }}
    >
      {/* ⋯ 메뉴 버튼 (hover 시 상단 오른쪽에 표시) */}
      {hovering && (
        <div style={{ position: "absolute", top: 10, right: 10 }}>
          <MoreVertical
            size={18}
            style={{ cursor: "pointer", color: "#6b7280" }}
            onClick={() => setShowMenu((prev) => !prev)}
          />
          {showMenu && (
            <div
              style={{
                position: "absolute",
                top: 20,
                right: 0,
                background: "#fff",
                border: "1px solid #e5e7eb",
                borderRadius: 6,
                boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                zIndex: 10,
              }}
            >
              <div style={menuItem} onClick={() => alert("✏️ 수정 클릭됨")}>
                ✏️ 수정
              </div>
              <div style={menuItem} onClick={() => alert("🗑️ 삭제 클릭됨")}>
                🗑️ 삭제
              </div>
            </div>
          )}
        </div>
      )}

      {/* 👤 작성자 + 시간 (한 줄) */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          marginBottom: 6,
          fontWeight: "bold",
          color: "#111827",
        }}
      >
        <span>{comment.user}</span>
        <span style={{ fontWeight: "normal", color: "gray", fontSize: "0.8rem" }}>
          · {comment.time}
        </span>
      </div>

      {/* 본문 */}
      <p style={{ margin: 0, color: "#374151", lineHeight: "1.5" }}>{comment.text}</p>

      {/* 👇 답글 보기 / 말풍선 입력창 토글 */}
      {!isReply && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 12 }}>
          <button
            onClick={() => setShowReplies(!showReplies)}
            style={textBtn}
          >
            {showReplies
              ? "▼ 답글 숨기기"
              : `▶ ${hasReplies ? `${comment.replies.length}개의 답글 보기` : "답글 보기"}`}
          </button>

          <div
            onClick={() => setShowReplyInput(!showReplyInput)}
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              color: "#2563eb",
            }}
            title="답글 달기"
          >
            <MessageCircle size={16} />
          </div>
        </div>
      )}

      {/* 🧩 답글 리스트 */}
      {showReplies && hasReplies && (
        <div
          style={{
            marginTop: 10,
            marginLeft: 24,
            borderLeft: "2px solid #e5e7eb",
            paddingLeft: 12,
          }}
        >
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              onAddReply={onAddReply}
              isReply={true}
            />
          ))}
        </div>
      )}

      {/* ✏️ 입력창 (말풍선 클릭 시) */}
      {showReplyInput && (
        <div style={{ marginTop: 10, marginLeft: isReply ? 10 : 24 }}>
          <CommentInput
            onAddComment={handleReplySubmit}
            placeholder="답글을 입력하세요..."
          />
        </div>
      )}
    </div>
  );
}

const textBtn = {
  background: "none",
  border: "none",
  color: "#2563eb",
  fontSize: "0.8rem",
  cursor: "pointer",
  padding: 0,
};

const menuItem = {
  padding: "6px 12px",
  cursor: "pointer",
  fontSize: "0.85rem",
  color: "#374151",
  whiteSpace: "nowrap",
  transition: "background 0.2s",
  borderRadius: 4,
  userSelect: "none",
  hover: { background: "#f3f4f6" },
};



