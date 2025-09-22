// 페이지찾기 - 게시판
import {useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import { useAccount } from "../../auth/AuthContext";
import FilterList from "../../components/ui/FilterList";
import GroupDropdown from "../../components/ui/GroupDropdown";

export default function Board(){
    const navigate = useNavigate();
    const {user} = useAccount();
    const filterArr = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "Q&A", "면담", "임시 저장"]
    

    return (
        <div className="boardPage">
            <h2>게시판</h2>
            <div className="filterList">
                <div className="ftList_L">
                    <GroupDropdown coSn={user.USER_OGDP_CO_SN}></GroupDropdown>
                    <FilterList arr={filterArr}></FilterList>
                </div>
                <div className="ftList_R">
                    <div className="createBtn" onClick={() => navigate('createPost')}>
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