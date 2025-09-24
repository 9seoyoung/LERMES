import React, { useState } from 'react';

import FilterList from '../../../components/ui/FilterList';
import ListTable from '../../../components/ui/ListTable';
import {Settings} from "lucide-react";
import ListEditTable from '../../../components/ui/ListEditTable';

export default function AccountSet() {
  const [manageState, setManageState] = useState(false);
  const [selectedIdx, setSelected] = useState(0);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // formData 초기값
    // 0. 유저테이블 리스트 객체배열로 보내주셈
    // 1. useEffect로 마운트 시 유저테이블 리스트 불러오기
    // 2. 불러온 내용 setFormData로 펼쳐서 저장하기
  });
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

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
        <div className="boardPage">
            <h2>계정 관리</h2>
            <div className="filterList">
                <ul className="ftList_L">
                    <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected}></FilterList>
                </ul>
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
            </div>
            <div className="BigListBox">
              {manageState ? 
                <ListEditTable 
                tableHead={['순번', '직책' ,'이름', '이메일', '전화번호', '담당그룹', '권한레벨', '블랙']}
                columnData={['no', 'hat', 'name','email', 'tel', 'duty', 'authLv', 'blacklist']}
                apiData={[{no: 1, name:"하이", email:"ㄴㄴ", tel:"ㅁ"}, {no: 1, name:"하이", email:"ㄷㄷ", tel:"ㄴ"}]}
                gridTemplate="0.5fr 0.5fr 1fr 1fr 2fr 2fr 2fr 1fr 1fr"
                formData={formData}
                type = {['text', 'date', 'email', 'tel']}
                />
                :
                <ListTable
                tableHead={['순번', '직책' ,'이름', '이메일', '전화번호', '담당그룹', '권한레벨', '블랙']}
                columnData={['no', 'hat', 'name','email', 'tel', 'duty', 'authLv', 'blacklist']}
                apiData={[{no: 1, name:"하이", email:"ㄴㄴ", tel:"ㅁ"}]}
                // 문자열로 지정
                gridTemplate="0.5fr 1fr 1fr 2fr 2fr 2fr 1fr 1fr"
                gap="12px"
                handleChange = {handleChange}
              /> 
              } 
            </div>
        </div>
  )
}
