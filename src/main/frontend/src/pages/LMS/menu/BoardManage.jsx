// 페이지찾기 - 게시판
import { useEffect, useMemo, useState } from "react";
import {useNavigate } from "react-router-dom";
import ListTable from "../../../components/ui/ListTable";
import { useAccount } from "../../../auth/AuthContext";
import FilterList from "../../../components/ui/FilterList";
import GroupDropdown from "../../../components/ui/GroupDropdown";
import { matchedPathAdminBoardFilter, matchedListAPIAdminBoardFilter } from "../../../utils/readPageTypeReturn";
import { toast } from "react-toastify";

export default function BoardManage(){
    const navigate = useNavigate();
    const [selectedIdx, setSelected] = useState(0)
    const {user} = useAccount();
    const filterArr = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "Q&A", "면담요청", "면담기록", "임시저장"]
    // const [filter, setFilter] = useState("");
    const [whereTogo, setWhereToGo] = useState("/");
    const [cohortSn, setCohortSn] = useState(null);
    const [pullList, setPullList] = useState([]);
    
    const filter = filterArr[selectedIdx];
    const path = useMemo(() => matchedPathAdminBoardFilter(filter), [filter]);

    const splitWroteDate = (v) => v.split("T", 1);

    const toReUseObject = (pullList) => ({
        type: pullList.postType ?? "-",
        title: pullList.ITV_APLY_TTL ?? "-",
        wroteDate: splitWroteDate(pullList.ITV_APLY_DT ?? "-"),
        author: pullList.ITV_APLCNT_SN ?? "-",
        views: "미구현"
      });
      
      // 배열 캐스팅
      const reUseArray = pullList.map(toReUseObject);
    
    useEffect(() => {
        const listApi = matchedListAPIAdminBoardFilter(filter);
        console.log(` listApi = ${listApi}`);
        console.log(`cohortSn ${cohortSn}`);
        console.log(`filter ${filter}`);
        console.log(`path ${path}`);
        console.log(`path ${user.USER_OGDP_CO_SN}`)

    const req = {
        roleType: user.USER_AUTHRT_SN,
        cohortSn: cohortSn || 0,
        filter: filter,
        path: path,
        fixedSn: null}

    if (!listApi) {
      setPullList([]);  // 미구현 필터면 빈 리스트
      return;
    }
    (async () => {
    

      try {
        console.log(`req >>>>>>>>>>>>>>>>>`);
        console.log(req);
        const { data } = await listApi(req); // ← API 함수 호출
        setPullList(data);
        console.log(data);
        toast.success("데이터 불러옴");
      } catch (err) {
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
                    tableHead={['순번', '유형', '제목', '작성일', '작성자', '조회수']}
                    columnData={['no',  'type', 'title', 'startDate', 'endDate', 'date', 'name', 'views']}
                    apiData={pullList}
                    // 문자열로 지정
                    gridTemplate="0.5fr 0.5fr 5fr 1fr 1fr 0.5fr "
                    gap="12px"
                    whereTogo = {whereTogo}
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