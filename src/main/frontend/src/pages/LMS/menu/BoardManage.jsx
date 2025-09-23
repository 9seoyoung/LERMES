// 페이지찾기 - 게시판
import { useState } from "react";
import {useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import uiStyle from "../../../styles/UiComp.module.css"
import { useAccount } from "../../../auth/AuthContext";
import FilterList from "../../../components/ui/FilterList";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { StudySched_Tb } from "../../../components/module/TableAll";

export default function Board(){
    const [selectedIdx, setSelected] = useState(0)
    const navigate = useNavigate();
    const {user} = useAccount();
    const filterArr = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "Q&A", "면담요청", "면담기록", "임시 저장"]
    


    return (
        <div className="boardPage">
            <h2>게시판</h2>
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
                <StudySched_Tb ></StudySched_Tb>
            </div>
        </div>
    );
}