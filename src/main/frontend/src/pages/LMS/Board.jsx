// 페이지찾기 - 게시판
import { useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import FilterList from "../../components/ui/FilterList";
import { useState } from "react";

export default function Board(){
    const navigate = useNavigate();
    const [selectedIdx, setSelected] = useState(0) 
    const filterArr = ["전체", "공지", "자료실", "설문", "FAQ", "Q&A", "임시 저장"]
    const [pullList, setPullList] = useState([]);
    const [columnData, setColumnData] = useState([]);
    const [postKey, setPostKey] = useState("");
    const [whereTogo, setWhereToGo] = useState("");

    return (
        <div className="boardPage">
            <h2>게시판</h2>
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
                tableHead={['순번', '유형', '제목', '작성일', '작성자', '조회수']}
                columnData={columnData}
                apiData={pullList}
                // 문자열로 지정
                gridTemplate="0.5fr 1fr 5fr 1.25fr 1fr 1fr"
                gap="12px"
                postKey={postKey}
                whereTogo={whereTogo}
              /> 
            </div>
        </div>
    );
}