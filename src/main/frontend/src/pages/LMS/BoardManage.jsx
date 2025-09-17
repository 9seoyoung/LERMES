// 페이지찾기 - 게시판
import { useLocation, useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import { useAccount } from "../../auth/AuthContext";
import Dropdown from "../../components/ui/Dropdown";
import { useEffect, useState } from "react";
import {hortlistByCpSn} from "../../services/cohortService"
import FilterList from "../../components/ui/FilterList";
import { toast } from "react-toastify";

export default function Board(){
    const navigate = useNavigate();
    const {user} = useAccount();
    const [hortlist, setHortList] = useState([]);

    useEffect(() => {
        (async () => {
            const coSn = user.USER_OGDP_CO_SN
          try {
            console.log(coSn);
            console.log(`>>>>>>>>>>>>>>>hortlistByCpSn(회사별 모집공고 리스트) 호출`)
            const data = await hortlistByCpSn(coSn);
            console.log(`<<<<<<<<<<<<<<< 반환 ${data}`)
            setHortList(data);
          } catch (e) {
            console.log(e.message);
          }
        })();
      }, []);
    

    return (
        <div className="boardPage">
            <h2>게시판</h2>
            <div className="filterList">
                <div className="ftList_L">
                    <Dropdown label="그룹" >
                        { hortlist.map((group) => (
                            <div className="subMenulist">{group.COHORT_NM}</div>
                        ))}
                    </Dropdown>
                    <FilterList></FilterList>
                </div>
                <div className="ftList_R">
                    <div className="createBtn" onClick={() => navigate('\createPost')}>
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