// 페이지찾기 - 게시판
import { useEffect, useMemo, useState } from "react";
import {useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import { useAccount } from "../../../auth/AuthContext";
import FilterList from "../../../components/ui/FilterList";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { ADMIN_BOARD_MENU_FILTER_COLUMNDATA, ADMIN_BOARD_MENU_FILTER, ADMIN_SELECT_POST_SN_KEY, ADMIN_BOARD_API_FILTER, ADMIN_SELECT_DETAIL_PAGE_PATH } from "../../../utils/readPageTypeReturn";
import { toast } from "react-toastify";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { callAllPostByTypeAndCohortSn } from "../../../services/postService";
import { formatDate } from "../../../utils/dateformat";

export default function BoardManage(){
  const navigate = useNavigate();
  const {effectiveSn} = useSelectedCompany();
  const {user} = useAccount();
  const [selectedIdx, setSelected] = useState(0) 
  const [pullList, setPullList] = useState([]);
  const [columnData, setColumnData] = useState([]);
  const [postKey, setPostKey] = useState("");
  const [whereTogo, setWhereToGo] = useState("");
  const [cohortSn, setCohortSn] = useState(null);
    
    const filterArr = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "Q&A", "면담요청", "면담기록", "학습일지"]
    
    //게시물 목록 불러오기
    useEffect(() => {
        const userCohortSn = user?.USER_COHORT_SN;
        const bbsType = ADMIN_BOARD_MENU_FILTER[selectedIdx];
        const api = ADMIN_BOARD_API_FILTER[selectedIdx];

        // console.log(cohortSn, bbsType, api);

        setWhereToGo("/");
        console.log(filterArr[selectedIdx]);
        setColumnData(ADMIN_BOARD_MENU_FILTER_COLUMNDATA[selectedIdx]);
        setPostKey(ADMIN_SELECT_POST_SN_KEY[selectedIdx]);
        setWhereToGo(ADMIN_SELECT_DETAIL_PAGE_PATH[selectedIdx])

        const params = {};

        if(cohortSn != null) params.cohortSn = cohortSn;
        if(bbsType != "전체") params.bbsType = bbsType;
        if(effectiveSn != null) params.effectiveSn = effectiveSn;

        console.log(user);

        (async () => {



            try{
                const {data} = await api(params);
                console.log(data);
                const formattedData = data.map(item => ({...item, formattedAPostFrstDt:  formatDate(item.postFrstWrtDt),}));
                setPullList(formattedData);
            } catch(err) {
                toast.error(err.message);
            }
        }
    )();
    }, [selectedIdx, cohortSn])


    return (
        <div className="boardPage">
            <h2>게시물 관리</h2>
            <div className="filterList">

                <ul className="ftList_L">
                    <GroupDropdown coSn={effectiveSn} setCohortSn={setCohortSn}></GroupDropdown>
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
                tableHead={['#', '유형', '제목', '작성일', '작성자', '조회수']}
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

// 면담리스트 응답 정보
/**
 * COHORT_SN 기수
ITV_APLCNT_SN "작성자"
ITV_APLY_CN "내용"
ITV_APLY_DT "2025-09-22T17:06:17"
ITV_APLY_TTL "제목"
ITV_PIC_AUTHRT "공개범위"
ITV_SN "면담일련번호"
 */