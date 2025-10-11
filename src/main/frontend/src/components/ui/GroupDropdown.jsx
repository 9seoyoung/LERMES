import { useState, useEffect } from "react";
import { hortlistByCpSn } from "../../services/cohortService";
import Dropdown from "./Dropdown";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";

function GroupDropdown({setCohortSn}) {
  const { effectiveSn } = useSelectedCompany();
  const [hortlist, setHortList] = useState([]);
  const [groupFilter, setGroupFilter] = useState(null)
    console.log("그룹 변경")


  useEffect(() => {
      (async () => {
        try {
          // console.log(coSn);
          // console.log(`>>>>>>>>>>>>>>>hortlistByCpSn(회사별 모집공고 리스트) 호출`)
          const data = await hortlistByCpSn(effectiveSn);
          const cohorts = data.data.cohorts || [];
          setHortList(cohorts);
  
          // 🔹 바로 응답 데이터를 이용해서 초기값 설정
          if (cohorts.length > 0) {
            setGroupFilter(cohorts[0].cohortNm);
            setCohortSn(cohorts[0].cohortSn);
          }
          // console.log(data.data.map((value, idx)=> `${value.cohortNm} + ${idx}`))
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, [effectiveSn]);
  return (
    <div className="dropSet" style={{minWidth: "100px", maxwidth:"100px", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
      <Dropdown className="dropset_dd" label={groupFilter || hortlist[0]?.cohortNm} >
        {/* <p className=".subMenuList" onClick={()=> {setGroupFilter("All"); setCohortSn(null)}} >All</p> */}
      { hortlist.map((hortlist, idx) => (
          <p className=".subMenuList" key={idx} onClick={()=> {console.log("그룹선택>>>>>>>>>>>>>>>>>>>>>>>>>>>>");setGroupFilter(`${hortlist.cohortNm}`);setCohortSn(hortlist.cohortSn); }} >{hortlist.cohortNm}</p>
      ))}
      </Dropdown>
    </div>
  )
}

export default GroupDropdown