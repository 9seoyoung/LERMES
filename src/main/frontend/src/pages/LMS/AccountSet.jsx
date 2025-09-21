import React, { useState } from 'react';

import FilterList from '../../components/ui/FilterList';
import ListTable from '../../components/ui/ListTable';
import uiStyle from "../../styles/UiComp.module.css";
import {Settings} from "lucide-react";

export default function AccountSet() {
  const [manageState, setManageState] = useState(false);
  const [loading, setLoading] = useState(false);
  const filterArr = ["직원", "강사", "수강생"];

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

  return (
        <div className="boardPage">
            <h2>계정 관리</h2>
            <div className="filterList">
                <ul className="ftList_L">
                  <FilterList arr={filterArr}></FilterList>
                </ul>
                <div className="ftList_R">
                  {manageState ? (
                    // 저장 모드
                    <button
                      type="button"
                      className="createBtn"
                      onClick={handleSubmit}
                      disabled={loading}
                    >
                      {loading ? "저장중..." : "저장"}
                    </button>
                  ) : (
                    // 관리 모드로 전환 버튼
                    <button
                      type="button"
                      className="createBtn"
                      onClick={() => setManageState(true)}
                    >
                      <Settings size={20} strokeWidth={2} />
                      관리
                    </button>
                  )}
                </div>
            </div>
            <div className="BigListBox">
                <ListTable
                tableHead={['순번', '이름', '이메일', '전화번호']}
                columnData={['no', 'name', 'email', 'tel']}
                apiData={[{no: 1, name:"하이", email:"ㄴㄴ", tel:"ㅁ"}]}
                // 문자열로 지정
                gridTemplate="1fr 1fr 2fr 1.2fr"
                gap="12px"
              />
            </div>
        </div>
  )
}
