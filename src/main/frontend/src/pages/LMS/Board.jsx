// 페이지찾기 - 게시판
import { useLocation, useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import { useAccount } from "../../auth/AuthContext";

export default function Board(){
    const navigate = useNavigate();
    const {user} = useAccount();
    

    return (
        <div className="boardPage">
            <h2>게시판</h2>
            <div className="filterList">
                <div className="ftList_L">필터 리스트</div>
                <div className="ftList_R">
                    <div onClick={() => navigate('\createPost')} style={{background:"#FCFEFF", padding:"0 4px", borderRadius:"4px", boxShadow:"2px 2px 2px #00000025"}}>
                        + 등록하기
                    </div>
                </div>
            </div>
            <div className="BigListBox">
                <ul className={uiStyle.ListHeader}>
                    <li>순번</li>
                    <li>유형</li>
                    <li>제목</li>
                    <li>작성일</li>
                    <li>작성자</li>
                    <li>조회수</li>
                </ul>
                <ListTable></ListTable>
            </div>
        </div>
    );
}