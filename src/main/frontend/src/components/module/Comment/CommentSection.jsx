import React, {useEffect, useRef, useState} from "react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import {createComment, pullCommentList} from "../../../services/postService";
import {toast} from "react-toastify";
import { useAccount } from "../../../auth/AuthContext";
import { timeAgo } from "../../../utils/dateformat";

export default function CommentSection({postSn}) {
  const newCommentRef = useRef(null);       // 새로 달린 댓글 요소
  const scrollBoxRef = useRef(null);        // 댓글 리스트 스크롤 박스
  const pollTimerRef = useRef(null);        // 폴링 타이머
  const startedRef = useRef(false);         // StrictMode 이중 실행 가드
  const pendingScrollRef = useRef(false);   // 내가 방금 쓴 댓글일 때만 스크롤

  const {user} = useAccount();

  const [comments, setComments] = useState([
    {
      id: 1,
      user: "아저씨",
      time: "2분 전",
      text: "안녕하세요 반갑습니다!",
      replies: [],
    },
  ]);
  const [lastAddedId, setLastAddedId] = useState(null); // 방금 추가한 댓글 id

  // ✅ 새 댓글 추가 (맨 아래에 추가 + 스크롤 예약)
  const handleAddComment = (newText) => {
    const newId = `${user ? `${user.USER_AUTHRT_SN}-${Date.now()}` : `7-${Date.now()}`}`;
    const newComment = {
      id: newId,
      cmntSn: '',
      user: user?.USER_NM ?? "방문자",
      time: timeAgo(Date.now()),
      text: newText,
      replies: [],
    };
    (async () => {
      try {
        const {data} = await createComment(postSn, newComment);
        console.log(data);
      } catch (err){
        toast.error(err.message);
      }
      pendingScrollRef.current = true;                  // 🔸 스크롤 예약
      setComments(prev => [...prev, newComment]);       // 🔸 맨 아래에 추가
      setLastAddedId(newId);                            // 🔸 방금 추가한 id
    })();
  };

  // ✅ 방금 쓴 댓글이 렌더된 경우에만, 댓글 박스 안에서만 스크롤
  useEffect(() => {
    if (!pendingScrollRef.current) return;
    const box = scrollBoxRef.current;
    const el = newCommentRef.current;
    if (!box || !el) return;

    // el이 박스 안에서 보이도록 박스만 스크롤
    const targetTop = el.offsetTop - box.offsetTop;
    const targetBottom = targetTop + el.offsetHeight;
    const nextTop = Math.max(0, targetBottom - box.clientHeight);
    box.scrollTo({ top: nextTop, behavior: "smooth" });

    pendingScrollRef.current = false; // 한 번만
  }, [comments, lastAddedId]);

  // ✅ 3초 폴링 (요청 종료 후 재예약) + 내가 방금 쓴 댓글 렌더 전엔 덮어쓰기 보류
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let stopped = false;

    const fetchOnce = async () => {
      if (stopped) return;

      // 방금 쓴 댓글을 DOM에 붙이기 전이면 서버로 덮어쓰지 않음
      if (pendingScrollRef.current) {
        pollTimerRef.current = setTimeout(fetchOnce, 3000);
        return;
      }

      try{
        const {data} = await pullCommentList(postSn);
        console.log(data);
        const formattedComment = (data || [])
          .map((item) => ({
            id: item.cmntSn ?? item.cmntWrtrSn,                      // 가급적 고유키
            user: item.cmntWrtrNm ?? user.USER_NM,    // 외부 user 의존 X
            ts: new Date(item?.cmntLastMdfcnDt ?? item?.cmntFrstWrtDt).getTime(),
            time: timeAgo(item?.cmntLastMdfcnDt ?? item?.cmntFrstWrtDt),
            text: item.cmntCn,
            replies: item.parentCmntSn ? [item.parentCmntSn] : [],
          }))
          .sort((a, b) => a.ts - b.ts);                              // 오래된→최신 (최신이 아래)

        setComments(() => formattedComment);
      } catch (err){
        toast.error(err.message);
      } finally {
        if (!stopped) {
          pollTimerRef.current = setTimeout(fetchOnce, 3000);
        }
      }
    };

    fetchOnce();

    return () => {
      stopped = true;
      if (pollTimerRef.current) clearTimeout(pollTimerRef.current);
      startedRef.current = false;
    };
  }, [postSn]);

  return (
    <div
      style={{
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        boxShadow: "0 2px 6px rgba(0,0,0,0.05)",
        maxWidth: 900,
        margin: "0 auto",
        width:"100%",
        height:"100%",
      }}
    >
      <div
        style={{
          width:"100%",
          display:"flex",
          flexDirection:"column",
          height:"100%",
          justifyContent:"space-between",
        }}
      >
        <h3>💬 Comments</h3>

        {/* 🔸 스크롤 박스: ref 여기다 */}
        <div style={{flex:1, overflowY: "scroll"}} ref={scrollBoxRef}>
          {/* ⚠️ 아래 내부 div의 overflowY:"scroll"는 제거하는 게 안전 */}
          <div>
            {comments.map((c, idx) => (
              // 새로 추가한 댓글 wrapper에만 ref 부착
              <div
                key={`${c.id}-${idx}`}
                ref={c.id === lastAddedId ? newCommentRef : null}
              >
                <CommentItem comment={c} />
              </div>
            ))}
          </div>
        </div>

        <CommentInput onAddComment={handleAddComment} />
      </div>
    </div>
  );
}