import React, { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { ChevronLeft, ChevronRight} from "lucide-react";


import SuperHeader from './SuperHeader';

import uiStyle from "../../../styles/UiComp.module.css"
import { useAccount } from '../../../auth/AuthContext';


export default function LmsHeader({navToggle, setNavToggle}) {
    const {user} = useAccount();
    const navigate = useNavigate();
    const curloc = useLocation();
    const navKind = curloc.pathname.split('/', 2)[1];

  // 헤더 종류 고르기
    function HeaderStatus({ loc }) {
      let component;

      switch (loc) {
        case "adminHome":
          component = <AdminHeader />;
          break;
        case "stdHome":
          component = <StdHeader />;
          break;
        case "tutorHome":
          component = <TutorHeader />;
          break;
        default:
          component = <SuperHeader />;
      }

      return component;
    }


  return (
    <>
      <div className="header_L" >
        <button className='navBtn' type='button' onClick={() => setNavToggle(!navToggle)}>
          {navToggle ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>
        {/* USER_OGDP_CO_SN 로 CO_NM 과 회사 로고이미지 가져오기 < 컬럼없음 */}
          <img src={process.env.PUBLIC_URL + '/img/logo.png'}  alt="Logo" onClick={() => {navigate(`/${navKind}`); console.log(user)}}/>
      </div>
      <HeaderStatus loc={navKind}></HeaderStatus>
    </>
  )
}

export function StdHeader() {
  const [modalToggle, setModalToggle] = useState(false);
  const [atdStat, setAtdStat] = useState(null);


  return(
    <div className='header_R'>
      <div className={uiStyle.statusBtn}>
          <div>입실</div>
          {/* 입실시간 변수로 받아오기 */}
          <div>00:00:00</div>
      </div>
      <div className={uiStyle.statusBtn}>
          <div>퇴실</div>
          {/* 퇴실시간 변수로 받아오기 */}
          <div>00:00:00</div>
      </div>
      <button type='button' onClick={() => setModalToggle(!modalToggle)} className={uiStyle.checkInBtn}>출석</button >
    </div>
  );
}

export function TutorHeader() {
  const [modalToggle, setModalToggle] = useState(false);
  const [atdCode, setCode] = useState(null);

  return(
    <div className='header_R'>
      <button type='button' onClick={() => setModalToggle(!modalToggle)} className={uiStyle.checkInBtn}>출석</button >
    </div>
  );
}

export function AdminHeader() {
  return
}