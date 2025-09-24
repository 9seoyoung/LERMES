// 페이지찾기 - 게시판
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import uiStyle from "../../../styles/UiComp.module.css"
import { useAccount } from "../../../auth/AuthContext";
import FilterList from "../../../components/ui/FilterList";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { StudySched_Tb } from "../../../components/module/TableAll";
import { matchedPathAdminBoardFilter } from "../../../utils/readPageTypeReturn";

export default function Board(){
    const [selectedIdx, setSelected] = useState(0)
    const navigate = useNavigate();
    const {user} = useAccount();
    const filterArr = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "Q&A", "면담요청", "면담기록", "임시 저장"]
    const [whereTogo, setWhereToGo] = useState("/");
    
    useEffect(()=>{
        setWhereToGo(matchedPathAdminBoardFilter(filterArr[selectedIdx]));
    },[selectedIdx])

    return (
        <div className="boardPage">
            <h2>게시물 관리</h2>
            <div className="filterList">
                <div className="ftList_L">
                    <GroupDropdown coSn={user.USER_OGDP_CO_SN}></GroupDropdown>
                    <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected}></FilterList>
                </div>
                <div className="ftList_R">
                    <div className="createBtn" onClick={() => navigate('createPost')}>
                        + 등록하기
                    </div>
                </div>
            </div>
            <div className="BigListBox">
                <ListTable
                    tableHead={['순번', '유형', '제목', '시작일', '종료일', '작성일', '작성자', '조회수']}
                    columnData={['no',  'type', 'title', 'startDate', 'endDate', 'date', 'name', 'views']}
                    apiData={[{no: 1, type: "공지", title: "커리큘럼 같은 공식 일정(관리자 등록)", startDate: "25.09.07", endDate: "25.09.07", date: "25.09.07", name:"하이", views: 2}]}
                    // 문자열로 지정
                    gridTemplate="1fr 1fr 5fr 1fr 1fr 1fr 1fr 1fr "
                    gap="12px"
                    whereTogo = {whereTogo}
                />
            </div>
        </div>
    );
}