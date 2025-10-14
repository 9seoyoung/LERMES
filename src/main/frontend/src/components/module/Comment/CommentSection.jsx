import React, {useEffect, useState} from "react";
import CommentItem from "./CommentItem";
import CommentInput from "./CommentInput";
import {createComment, pullCommentList} from "../../../services/postService";
import {toast} from "react-toastify";

export default function CommentSection({postSn}) {
  const [comments, setComments] = useState([
    {
      id: 1,
      user: "아저씨",
      time: "2분 전",
      text: "안녕하세요 반갑습니다!",
      replies: [],
    },
  ]);


  // ✅ 새 댓글 추가
  const handleAddComment = (newText) => {
    const newComment = {
      id: Date.now(),
      user: "나",
      time: "방금 전",
      text: newText,
      replies: [],
    };
    setComments([newComment, ...comments]);
      (async () => {
          try {
              const {data} = await createComment(postSn, comments);
                console.log(data);
          } catch (err){
              toast.error(err.message);
          }
      })();
  };

  // ✅ 특정 댓글에 대댓글 추가
  const handleAddReply = (parentId, replyText) => {
    const updated = comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [
            ...comment.replies,
            {
              id: Date.now(),
              user: "나",
              time: "방금 전",
              text: replyText,
            },
          ],
        };
      }
      return comment;
    });
    setComments(updated);
  };


    useEffect(() => {
        (async () => {
            try{
                const {data} = await pullCommentList(postSn);
                console.log(data);
                const formattedComment = data.map((item) => ({
                    id: item.cmntWrtrSn,
                    user: `${item.cmntWrtrSn}번 유저`,
                    time: item.cmntLastMdfcnDt ?? item.cmntFrstWrtDt,
                    text: item.cmntCn,
                    replies: [item.parentCmntSn],
                }));

                setComments(formattedComment);
            } catch (err){
                toast.error(err.message);
            }

        })();
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
      }}
    >
      <h3>💬 Comments</h3>

      {comments.map((c, idx) => (
        <CommentItem
          key={`${c.id}-${idx}`}
          comment={c}
          onAddReply={handleAddReply}
        />
      ))}

      <CommentInput onAddComment={handleAddComment} />
    </div>
  );
}


