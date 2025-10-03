import React from 'react'
import { applyEmp } from '../../services/accountService';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';

function UnknownHome() {
  const { effectiveSn } = useSelectedCompany();
  const handleSubmit = () => {

    (async () => {
      try{
        const res = await applyEmp(effectiveSn);
        console.log(res);
      } catch(err) {
        console.log(err.message);
      }
    })();
  }

  return (
    <div className='board' style={{width: "100%", background: "yellow",height: "100%"}}>
      <div>UnknownHome"로그인안함 1,7</div>
    </div>
  )
}

export default UnknownHome