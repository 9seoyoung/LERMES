import React, {useEffect, useRef, useState} from "react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import {createComment, pullCommentList} from "../../../services/postService";
import {toast} from "react-toastify";
import { useAccount } from "../../../auth/AuthContext";
import { formatTime, timeAgo } from "../../../utils/dateformat";

export default function CommentSection({postSn}) {
  const newCommentRef = useRef(null);
  const pollTimerRef = useRef(null);               // ★ 폴링 타이머 ref
  const startedRef = useRef(false);                // ★ StrictMode 이중실행 가드
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
  const [lastAddedId, setLastAddedId] = useState(null); // ★ 방금 추가한 댓글 id 추적


  // ✅ 새 댓글 추가 (원래 로직 유지 + 마지막 id만 기록)
  const handleAddComment = (newText) => {
    const newId = `${user ? `${user.USER_AUTHRT_SN}-${Date.now()}` : `7-${Date.now()}`}`; // ★
    const newComment = {
      id: newId,
      cmntSn: '',
      user: user?.USER_NM,
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
      setComments([...comments, newComment]);
      setLastAddedId(newId); // ★ 방금 추가한 아이템 표시용
    })();
  };

  // ★ 스크롤 전용 (comments가 바뀔 때, 마지막 추가건으로 이동)
  useEffect(() => {
    if (newCommentRef.current) {
      newCommentRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [comments, lastAddedId]);

  // ★ 3초 폴링 (요청 끝난 후 다음 예약)
  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    let stopped = false;

    const fetchOnce = async () => {
      if (stopped) return;

      try{
        const {data} = await pullCommentList(postSn);
        console.log(data);
        const formattedComment = (data || []).map((item) => ({
          id: item.cmntSn ?? item.cmntWrtrSn, // ★ 고유키 우선 cmntSn
          user: item.cmntWrtrNm ?? user.USER_NM,
          time: timeAgo(item?.cmntLastMdfcnDt ?? item?.cmntFrstWrtDt), // ★ 간단히
          text: item.cmntCn,
          replies: item.parentCmntSn ? [item.parentCmntSn] : [],
        }));
        setComments((prev) => {
          // ★ 서버 기준으로 덮어쓰기 (필요시 머지로 바꿔도 됨)
          return formattedComment;
        });
      } catch (err){
        toast.error(err.message);
      } finally {
        if (!stopped) {
          pollTimerRef.current = setTimeout(fetchOnce, 3000); // ★ 3초 후 재호출
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

        <div style={{flex:1, overflowY: "scroll"}}>
          <div style={{overflowY:"scroll"}}>

            {comments.map((c, idx) => (
              // ★ CommentItem을 건드리지 않고도 스크롤하려고 wrapper에 ref 부착
              <div
                key={`${c.id}-${idx}`}
                ref={c.id === lastAddedId ? newCommentRef : null} // ★ 방금 추가한 댓글에만 ref
              >
                <CommentItem
                  comment={c}
                  ref={idx === comments.length - 1 ? newCommentRef : null}
                  // onAddReply={handleAddReply}
                />
              </div>
            ))}
          </div>

        </div>

        <CommentInput onAddComment={handleAddComment} />
      </div>
    </div>
  );
}