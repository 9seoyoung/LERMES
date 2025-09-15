import React, { useEffect, useState } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import { FormUnderline, FormInput, FormBtn, DeleteBtn, OptionSelect, TextAreaBox } from '../../../components/ui/UiComp';
import styles from "../../../styles/UiComp.module.css"

function CreatePost() {
  const [value, setValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 막음
    console.log("제출됨:", value);
    // 여기서 fetch/axios 등으로 서버에 전송 가능
  };

  return (
    <div className="boardPage">
      <h2>게시판</h2>
      <div className="BigListBox">
        <h4 style={{fontWeight: "400"}}>게시글 등록하기</h4>
        <form className='formAreaRow' onSubmit={handleSubmit}>
          <div className='formArea_L'>
            <div className='inputSet'>
              <FormBtn textType={"제목"}></FormBtn>
              <FormInput textType={"제목을 입력하세요"}></FormInput>
            </div>
          </div>
          <div className='formArea_R'>
            <div className='dropSet'>
              <p>유형</p>
              <Dropdown className="dropset_dd" label="---- 필수 선택 ----">
                <p className={layoutStyles.subMenuList}>공지사항</p>
                <p className={layoutStyles.subMenuList}>자료실</p>
                <p className={layoutStyles.subMenuList}>학습일지</p>
                <p className={layoutStyles.subMenuList}>FAQ</p>
                <p className={layoutStyles.subMenuList}>Q&A</p>
              </Dropdown>
            </div>
            <OptionSelect></OptionSelect>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost