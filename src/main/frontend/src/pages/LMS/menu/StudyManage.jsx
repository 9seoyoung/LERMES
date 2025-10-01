import { useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import uiStyle from "../../../styles/UiComp.module.css"
import FilterList from "../../../components/ui/FilterList";
import { useState } from "react";

function StudyManage() {
    const navigate = useNavigate();
    const filterArr = ["전체", "공식", "내 일정", "일지", "자료실"];
    const [selectedIdx, setSelected] = useState(0)


    return (
        <div className="boardPage">
            <h2>학습 관리</h2>
            <div className="filterList">
                <ul className="ftList_L">
                    <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected}></FilterList>
                </ul>
                <div className="ftList_R">
                    <div className="createBtn " onClick={() => navigate('createPost')}>
                        + 등록하기
                    </div>
                </div>
            </div>
            <div className="BigListBox">
                <ListTable
                tableHead={['#', '유형', '제목', '시작일', '종료일', '작성일', '작성자', '조회수']}
                columnData={['no', 'type', 'title', 'startDate', 'endDate', 'postDate', 'author', 'views']}
                apiData={[{no: "columnData", type:"는", title:"프로퍼티", startDate:"이름", endDate: "apiData", postDate:"는", author:"객체", views:"배열"}]}
                // 문자열로 지정
                gridTemplate="1fr 1fr 4.25fr 1.25fr 1.25fr 1.25fr 1fr 1fr"
                gap="12px"
              /> 
            </div>
        </div>
    );
}

export default StudyManage