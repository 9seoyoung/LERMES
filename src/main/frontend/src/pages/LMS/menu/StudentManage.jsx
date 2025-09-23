import { useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
// import uiStyle from "../../../styles/UiComp.module.css"
import FilterList from "../../../components/ui/FilterList";
// import { useState } from "react";

function StudentManage() {
    const navigate = useNavigate();
    const filterArr = ["전체", "면담 신청", "면담 요청", "면담 기록", "임시저장"];


    return (
        <div className="boardPage">
            <h2>수강생 관리</h2>
            <div className="filterList">
                <ul className="ftList_L">
                    <FilterList arr={filterArr}>

                    </FilterList>
                </ul>
                <div className="ftList_R">
                    <div className="createBtn " onClick={() => navigate('interviewPost')}>
                        + 등록하기
                    </div>
                </div>
            </div>
            <div className="BigListBox">
                <ListTable
                tableHead={['순번', '유형', '제목', '면담일', '신청자', '담당자', '조회수', '작성일']}
                columnData={['no', 'type', 'title', 'interviewDate', 'author', 'mento', 'views', 'postDate']}
                apiData={[{no: "1", type:"면담요청", title:"columnData랑 key값 맞추셈", interviewDate:"2035-09-30", author: "김동식", mento:"구서영", views:"1", postDate:"2029-03-02"}]}
                // 문자열로 지정
                gridTemplate="1fr 1fr 4.25fr 1.25fr 1.25fr 1.25fr 1fr 1fr"
                gap="12px"
              /> 
            </div>
        </div>
    );
}

export default StudentManage