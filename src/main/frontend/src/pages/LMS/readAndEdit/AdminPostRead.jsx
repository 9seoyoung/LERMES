// 페이지찾기 - 게시판

import InterviewEditPost from "../form/InterviewEditPost";

export default function AdminPostRead({whereTogo}){
    


    return (
        <div className="boardPage">
            <h2>게시물 관리</h2>
            <div className="formAreaRow">
                <InterviewEditPost whereTogo={whereTogo}></InterviewEditPost>
            </div>
        </div>
    );
}
