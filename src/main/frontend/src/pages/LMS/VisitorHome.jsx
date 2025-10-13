import React from 'react'
import { applyEmp } from '../../services/accountService';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import { useAccount } from '../../auth/AuthContext';

function VisitorHome() {
  const { effectiveSn } = useSelectedCompany();
  const {user} = useAccount();
  const handleSubmit1 = () => {
    
    (async () => {
      const params = {
        userAuthrtSn: 4,
        companySn: effectiveSn,
        userSn: user?.USER_SN
      }
      try{
        const res = await applyEmp(params);
        console.log(res);
      } catch(err) {
        console.log(err.message);
      }
    })();
  }

  return (
    <div className='board' style={{width: "100%", background: "yellow",height: "100%"}}>
      <div>VisitorHome"권한없는사람 1, 6</div>
      <button type='button' onClick={handleSubmit1}>직원신청</button>
    </div>
  )
}

export default VisitorHome