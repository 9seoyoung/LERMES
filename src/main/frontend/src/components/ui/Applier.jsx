import { useState, useEffect } from "react";
import { applierListByCpSn } from "../../services/cohortService";
import Dropdown from "./Dropdown";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import styles from "../../styles/fontStyle.module.css";
import { pullAllAccount } from "../../services/accountService";

function Applier({handleChange}) {
  const { effectiveSn } = useSelectedCompany();
  const [applierList, setApplierList] = useState([]);
  const [groupFilter, setGroupFilter] = useState(null)
    console.log("그룹 변경")


  useEffect(() => {
      (async () => {
        try {
          // console.log(coSn);
          // console.log(`>>>>>>>>>>>>>>>applierListByCpSn(회사별 모집공고 리스트) 호출`)
          const { data: res4 } = await pullAllAccount({ ogdpCoSn: effectiveSn, userAuthrtSn: 4 });
          const { data: res5 } = await pullAllAccount({ ogdpCoSn: effectiveSn, userAuthrtSn: 5 });
          
          // 두 응답이 리스트 형태라면 이렇게 합치기
          setApplierList([...(res4 || []), ...(res5 || [])]);
          
          // 만약 data.list 안에 배열이 있다면
          // setApplierList([...(res4.list || []), ...(res5.list || [])]);
  
          // 🔹 바로 응답 데이터를 이용해서 초기값 설정
          if (applierList?.length > 0) {
            setGroupFilter(res4[0].userNm);
          }
          // console.log(data.data.map((value, idx)=> `${value.cohortNm} + ${idx}`))
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, [effectiveSn]);
  return (
    <div className="dropSet" style={{minWidth: "100px", maxwidth:"100px", whiteSpace:"nowrap", textOverflow:"ellipsis"}}>
      <Dropdown className="dropset_dd" label={groupFilter || applierList[0]?.userNm} >
        {/* <p className=".subMenuList" onClick={()=> {setGroupFilter("All"); setCohortSn(null)}} >All</p> */}
      { applierList?.map((applier, idx) => (
          <p className="subMenuList" key={idx} onClick={()=> {console.log("그룹선택>>>>>>>>>>>>>>>>>>>>>>>>>>>>");}} >
            {applier.userNm}
            <div >
              {/* {`[${applier.cohortSttsNm === "RECRUITING" ? "예정" : (applier.cohortSttsNm === "CANCELED" ? "폐강" : (applier.cohortSttsNm === "ONGOING" ? "진행" : "수료"))}]`} */}
          </div>
          </p>
      ))}
      </Dropdown>
    </div>
  )
}

export default Applier