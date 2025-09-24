import { useState, useEffect } from "react";
import { hortlistByCpSn } from "../../services/cohortService";
import Dropdown from "./Dropdown";

function GroupDropdown({coSn, setCohortSn}) {
  const [hortlist, setHortList] = useState([]);
  const [groupFilter, setGroupFilter] = useState("All")
    console.log("그룹 변경")


  useEffect(() => {
      (async () => {
        try {
          // console.log(coSn);
          // console.log(`>>>>>>>>>>>>>>>hortlistByCpSn(회사별 모집공고 리스트) 호출`)
          const data = await hortlistByCpSn(coSn);
          // console.log(`<<<<<<<<<<<<<<< 반환 ${data.data}`)
          setHortList(data.data || []);
          // console.log(data.data.map((value, idx)=> `${value.cohortNm} + ${idx}`))
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, [coSn]);
  return (
    <div className="dropSet" style={{minWidth: "100px", maxwidth:"100px", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
      <Dropdown className="dropset_dd" label={groupFilter || "All"} >
        <p className=".subMenuList" onClick={()=> {setGroupFilter("All"); setCohortSn(null)}} >All</p>
      { hortlist.map((hortlist, idx) => (
          <p className=".subMenuList" key={idx} onClick={()=> {console.log("그룹선택>>>>>>>>>>>>>>>>>>>>>>>>>>>>");setGroupFilter(`${hortlist.cohortNm}`); setCohortSn(hortlist.cohortSn)}} >{hortlist.cohortNm}</p>
      ))}
      </Dropdown>
    </div>
  )
}

export default GroupDropdown