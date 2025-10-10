import React, { useEffect, useState } from 'react';

import FilterList from '../../../components/ui/FilterList';
import ListTable from '../../../components/ui/ListTable';
import {Settings} from "lucide-react";
import ListEditTable from '../../../components/ui/ListEditTable';
import { hortlistByCpSn } from '../../../services/cohortService';
import { useSelectedCompany} from '../../../contexts/SelectedCompanyContext';
import { pullAllAccount, pullApplyEmp, pullTeacherAccount } from '../../../services/accountService';
import styles from '../../../styles/account.module.css';
import { FaArrowLeft } from "react-icons/fa";
import GroupDropdown from '../../../components/ui/GroupDropdown';


export default function AccountSet() {
  const [manageState, setManageState] = useState(false);
  const [tutorManageState, setTutorManageState] = useState(false);
  const [stdManageState, setStdManageState] = useState(false);
  const [selectedIdx, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [cohortList, setCohortList] = useState([]);
  const [teacherList, setTeacherList] = useState([]);
  const [stdList, setStdList] = useState([]);
  const [cohortSn, setCohortSn] = useState();
  const [accountList, setAccountList] = useState([]);
  const [dataListTop, setDataListTop] = useState([]);
  const [formData, setFormData] = useState({
    // formData 초기값
    // 0. 유저테이블 리스트 객체배열로 보내주셈
    // 1. useEffect로 마운트 시 유저테이블 리스트 불러오기
    // 2. 불러온 내용 setFormData로 펼쳐서 저장하기
  });
  const { effectiveSn } = useSelectedCompany();

  const filterArr = ["직원", "회원"];
  
  useEffect(() => {

    ( async () => {
      try {
      const account = await pullAllAccount(effectiveSn);
      const pendingEmp = await pullApplyEmp(effectiveSn);
        console.log(pendingEmp.data);
        console.log(account.data);
        setAccountList(account.data);
        setDataListTop(pendingEmp.data);
      } catch(err) {
        console.log(err);
      }
    })();
  }, [selectedIdx, cohortSn, effectiveSn])
 useEffect(() => {

  ( async () => {
    console.log(effectiveSn);
      try {
      const accountT = await pullTeacherAccount({ogdpCoSn: effectiveSn, ogdpCohortSn: cohortSn, userAuthrtSn: 4});
      const accountStd = await pullTeacherAccount({ogdpCoSn: effectiveSn, ogdpCohortSn: cohortSn, userAuthrtSn: [5, 6]});
        console.log(accountStd.data);
        console.log(accountT.data);
        setTeacherList(accountT.data);
        setStdList(accountStd.data);
      } catch(err) {
        console.log(err);
      }
    })();
  }, [cohortSn, effectiveSn])
  // 직원 / 강사 / 수강생 관리(수정 + 저장)할 핸들러
  const handleSubmit = async () => {
    setLoading(true)

    try {
      console.log("아직 연결 x");

    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
      setManageState(false);
    }
  }

  const handleSubmitT = async () => {
    setLoading(true)

    try {
      console.log("아직 연결 x");

    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
      setTutorManageState(false);
    }
  }

  const handleSubmitS = async () => {
    setLoading(true)

    try {
      console.log("아직 연결 x");

    } catch(err) {
      console.log(err);
    } finally {
      setLoading(false);
      setStdManageState(false);
    }
  }

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
        <div className="boardPage">
            <h2>계정 관리</h2>
            {selectedIdx === 0 ? 
              <>
                <div className="filterList" style={{padding: 0}}>
                    <ul className="ftList_L">
                        <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected} effectiveSn={effectiveSn}></FilterList>
                    </ul>
                </div>
                <div id={`${styles.boxCol}`}>
                  <div className={`${styles.tutorBox}`}>
                    <h4>직원 승인 대기</h4>
                    <ListTable
                      tableHead={['#', '이름', '이메일', '전화번호', '요청일', '승인', '거절']}
                      gridTemplate="0.5fr 1fr 2.5fr 1.6fr 2.5fr 0.5fr 0.5fr"
                      apiData={dataListTop}
                      columnData={["userSn", "email", "tel", "orgStartDate"]}
                      whereTogo={"/adminHome/accountSet"}
                      addStyle={{height: "160px", overflowY: "scroll", borderRadius: "8px", background: "var(--color-light-bg)"}}
                    >
                      {/**
                       * tableHead={[,'이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                        columnData={[ 'name','email', 'userTelno', 'memo','roleType', 'enabled']}
                       * 
                       */}
                    </ListTable>
                  </div>
                <h4 className='filterList'>직원 목록
                    <div className="ftList_R">
                    {manageState ? (
                      // 저장 모드
                      <button
                        type="button"
                        className="saveBtn"
                        onClick={handleSubmit}
                        disabled={loading}
                      >
                        {loading ? "저장중..." : "저장"}
                      </button>
                    ) : (
                      // 관리 모드로 전환 버튼
                      <button
                        type="button"
                        className="manageBtn"
                        onClick={() => setManageState(true)}
                      >
                        <Settings size={20} strokeWidth={2} />
                        관리
                      </button>
                    )}
                  </div>
                    </h4>
                  {manageState ? 
                    <ListEditTable 
                      tableHead={[,'이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                      columnData={[ 'name','email', 'userTelno', 'memo','roleType', 'enabled']}
                      apiData={accountList}
                      gridTemplate="0.5fr 0.3fr 1fr 2.5fr 1.6fr 1.5fr 0.7fr 1fr "
                      formData={formData}
                      type = {['text', 'email', 'tel', 'text', 'select', 'select' ]}
                      addStyle={{height: "160px", overflowY: "scroll", borderRadius: "8px", background: "var(--color-light-bg)"}}
                      options={{
                        roleType: [2, 3, 4, 5, 6],        // 객체 배열이라면 위에서 value/label 매핑
                        enabled: ['true','false'],   // 문자열 배열
                      }}
                    />
                    :
                    <ListTable
                      tableHead={['#', '이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                      columnData={['name','email', 'userTelno', 'memo', 'roleType', 'enabled']}
                      apiData={ accountList }
                      whereTogo={"/adminHome/accountSet"}
                      // 문자열로 지정
                      gridTemplate="0.5fr 1fr 2.5fr 1.6fr 1.5fr 0.7fr 1fr "
                      gap="12px"
                      handleChange = {handleChange}
                    /> 
                  } 
                </div>
              </>
              :
              // 회원관리 -----------------------------------------------------------------------------------------
              <>
                  <div className="filterList" style={{padding: 0}}>
                      <ul className="ftList_L">
                          <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected}></FilterList>
                      </ul>
                      <div className="ftList_R"></div>
                    </div>
                <div id={`${styles.boxCol}`}>
                  <div style={{border: "1px solid var(--font-color-base)", maxWidth: "300px", borderRadius: "8px"}}>
                    <GroupDropdown coSn={effectiveSn} setCohortSn={setCohortSn}></GroupDropdown>
                  </div>
                  {/* 강사 */}
                  <div className={`${styles.tutorBox}`}>
                  <h4 className='filterList'>강사 관리
                    <div className="ftList_R">
                      {tutorManageState ? (
                        // 저장 모드
                        <button
                          type="button"
                          className="saveBtn"
                          onClick={handleSubmitT}
                          disabled={loading}
                        >
                          {loading ? "저장중..." : "저장"}
                        </button>
                      ) : (
                        // 관리 모드로 전환 버튼
                        <button
                          type="button"
                          className="manageBtn"
                          onClick={() => setTutorManageState(true)}
                        >
                          <Settings size={20} strokeWidth={2} />
                          관리
                        </button>
                      )}
                    </div>
                  </h4>
                  {tutorManageState ? 
                    <ListEditTable 
                    tableHead={[,'이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                    columnData={[ 'name','email', 'userTelno', 'memo','roleType', 'enabled']}
                    apiData={teacherList}
                    gridTemplate="0.5fr 0.3fr 1fr 2.5fr 1.6fr 1.5fr 0.7fr 1fr "
                    formData={formData}
                    type = {['text', 'email', 'tel', 'text', 'select', 'select' ]}
                    addStyle={{height: "160px", overflowY: "scroll", borderRadius: "8px", background: "var(--color-light-bg)"}}
                    options={{
                      roleType: [2, 3, 4, 5, 6],        // 객체 배열이라면 위에서 value/label 매핑
                      enabled: ['true','false'],   // 문자열 배열
                    }}
                    />
                    :
                    <ListTable
                    tableHead={['#', '이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                    columnData={['name','email', 'userTelno', 'memo', 'roleType', 'enabled']}
                    apiData={ teacherList }
                    whereTogo={"/adminHome/accountSet"}
                    // 문자열로 지정
                    gridTemplate="0.5fr 1fr 2.5fr 1.6fr 1.5fr 0.7fr 1fr "
                    gap="12px"
                    addStyle={{height: "160px", overflowY: "scroll", borderRadius: "8px", background: "var(--color-light-bg)"}}
                    handleChange = {handleChange}
                  /> 
                  } 
                  </div>
                  <div className={`${styles.stdBox}`}>
                    <h4 className='filterList'>수강생 관리 
                    <div className="ftList_R">
                    {stdManageState ? (
                      // 저장 모드
                      <button
                        type="button"
                        className="saveBtn"
                        onClick={handleSubmitS}
                        disabled={loading}
                      >
                        {loading ? "저장중..." : "저장"}
                      </button>
                    ) : (
                      // 관리 모드로 전환 버튼
                      <button
                        type="button"
                        className="manageBtn"
                        onClick={() => setStdManageState(true)}
                      >
                        <Settings size={20} strokeWidth={2} />
                        관리
                      </button>
                    )}
                  </div>
                    </h4>
                  {stdManageState ? 
                    <ListEditTable 
                    tableHead={[,'이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                    columnData={[ 'name','email', 'userTelno', 'memo','roleType', 'enabled']}
                    apiData={stdList}
                    gridTemplate="0.5fr 0.3fr 1fr 2.5fr 1.6fr 1.5fr 0.7fr 1fr "
                    formData={formData}
                    type = {['text', 'email', 'tel', 'text', 'select', 'select' ]}
                    options={{
                      roleType: [2, 3, 4, 5, 6],        // 객체 배열이라면 위에서 value/label 매핑
                      enabled: ['true','false'],   // 문자열 배열
                    }}
                    />
                    :
                    <ListTable
                    tableHead={['#', '이름', '이메일', '전화번호', '메모', '권한레벨', '활성여부']}
                    columnData={['name','email', 'userTelno', 'memo', 'roleType', 'enabled']}
                    apiData={ stdList }
                    whereTogo={"/adminHome/accountSet"}
                    // 문자열로 지정
                    gridTemplate="0.5fr 1fr 2.5fr 1.6fr 1.5fr 0.7fr 1fr "
                    gap="12px"
                    handleChange = {handleChange}
                    
                  /> 
                  } 
                  </div>
                  </div>
                </>
            }
        </div>
  )
}
