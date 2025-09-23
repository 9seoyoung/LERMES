// 페이지찾기 - 게시판
import { useEffect, useState } from "react";
import {useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import { useAccount } from "../../../auth/AuthContext";
import FilterList from "../../../components/ui/FilterList";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { matchedPathAdminBoardFilter, matchedListAPIAdminBoardFilter } from "../../../utils/readPageTypeReturn";
import { toast } from "react-toastify";

export default function BoardManage(){
    const [selectedIdx, setSelected] = useState(0)
    const navigate = useNavigate();
    const {user} = useAccount();
    const filterArr = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "Q&A", "면담요청", "면담기록", "임시 저장"]
    const [filter, setFilter] = useState("");
    const [whereTogo, setWhereToGo] = useState("/");
    const [cohortSn, setCohortSn] = useState(null);
    const [pullList, setPullList] = useState([]);
   
    useEffect(() => {
    console.log(">>>>>>>>>>>>>필터변경>>>>>>>>>>>>>")
    console.log(`1. ${filter} 필터 누름`);
    // setFilter(filter);
    console.log(`2. setFilter 상태훅 사용`)
    console.log(`3.${filter} 저장 후 useEffect 내의 필터`)
    setWhereToGo(matchedPathAdminBoardFilter(filter));
    console.log(`4. ${whereTogo} whereTogo에 게시물 상세보기 페이지 화면경로 반환`);

    (async () => {
        const apiHandle = () => matchedListAPIAdminBoardFilter(filter);
        
        try {
            const {data} = await apiHandle({cohortSn, filter });
            toast.success("데이터불러옴");
            setPullList(data);
            console.log(pullList);
        } catch(err) {
            toast.error(err.message);
        }
        
    })();
    }, [filter, cohortSn]);

    return (
        <div className="boardPage">
            <h2>게시물 관리</h2>
            <div className="filterList">

                <div className="ftList_L">
                    <GroupDropdown coSn={user.USER_OGDP_CO_SN} setCohortSn={setCohortSn}></GroupDropdown>
                        <ul className="ftList_L">
                                { filterArr?.map((ft, idx) => (
                                <li
                                    key={idx}
                                    onClick={(e) => {
                                    // console.log(`idx: ${idx}`);
                                    // console.log(`cohortSn: ${cohortSn}`);
                                    // console.log(`filter:${filterArr[selectedIdx]}`)

                                    // console.log("찍히는거 맞나");
                                    setSelected(idx);
                                    setFilter(ft);
                                    // handleFilterChange();
                                    // handler(idx);
                                    console.log("필터변경>>>>>>>>>>>>>>>>>>>>>>>>")
                                    console.log(`whereToGo ${whereTogo}`)
                                    }}
                                    id= {selectedIdx === idx ? "ftClicked" : ""}
                                    >{ft}
                                    </li>
                                ))
                            }
                            {/* 추가 버튼 생성 및 눌렀을 때 배열에 데이터 추가하기 위한 버튼 */}
                            {/* {children} */}
                            </ul>
                    {/* <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected} whereTogo={whereTogo} filter={filter} setFilter={setFilter} setWhereToGo={setWhereToGo} filterArr={filterArr} cohortSn={cohortSn}></FilterList>
                    <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected} setWhereToGo={setWhereToGo} filterArr={filterArr} cohortSn={cohortSn}></FilterList> */}
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