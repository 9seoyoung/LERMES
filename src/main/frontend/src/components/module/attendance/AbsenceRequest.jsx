import { useEffect, useState } from "react"
import { countNewAbsenceExcuses } from "./absenceService"
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";


/**
 * 불러올 때 승인여부
 * @returns 
 */


function AbsenceRequest() {
  const [counts, setCounts] = useState(0);
  const { effectiveSn } = useSelectedCompany();


  useEffect(() => {
    const run = async () => {
      try {
        const res = await countNewAbsenceExcuses(effectiveSn);
        setCounts(res.data.pendingCount);
      } catch (err) {
        console.log(err);
      }
    };
  
    if (effectiveSn) run();
  }, [effectiveSn]);

  
  

  return (
    <>
      <div>미확인 출석 요청</div>
    {counts}
    </>
  )
}

export default AbsenceRequest