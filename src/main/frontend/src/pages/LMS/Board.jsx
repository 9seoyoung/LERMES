// 페이지찾기 - 게시판
import { useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import FilterList from "../../components/ui/FilterList";

export default function Board(){
    const navigate = useNavigate();

    const filterArr2 = ["전체", "공지", "자료실", "설문", "FAQ", "Q&A", "임시 저장"]

    return (
        <div className="boardPage">
            <h2>게시판</h2>
            <div className="filterList">
                <ul className="ftList_L">
                    <FilterList arr={filterArr2}></FilterList>
                </ul>
                <div className="ftList_R">
                    <div className="createBtn " onClick={() => navigate('createPost')}>
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