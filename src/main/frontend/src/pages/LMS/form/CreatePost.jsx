import React, { useEffect, useId, useState } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import { FormUnderline, FormInput, FormBtn, DeleteBtn, OptionSelect, TextAreaBox, FileUpload } from '../../../components/ui/UiComp';

function CreatePost() {
  const formId = useId();
  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 막음
  };
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    title: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;  
    setFormData((prev) => ({
      ...prev,
      [name]: value,   // name 속성(key)에 따라 값 저장
    }));
  };

  return (
    <div className="boardPage">
      <h2>게시판</h2>
      <div className="BigListBox">
        <h4 style={{fontWeight: "400"}}>게시글 등록하기</h4>
        <form className='formAreaRow' onSubmit={handleSubmit}>
          <div className='formArea_L'>
            <div className='formHeader'>
              <div className='inputSet'>
                <label className='formLabel' htmlFor={`${formId}_title`}>제목</label>
                <input id={`${formId}_title`} className='formInput' name='title' placeholder='제목을 입력하세요.' value={formData.title} onChange={handleChange}></input>
              </div>
            </div>
            <textarea></textarea>
            <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <ul className='addfileList'>
                <li><span>파일1 <DeleteBtn/></span></li>
              </ul>
            </div>
          </div>
          <div className='formArea_R'>
            <div className='selectBoxArea' style={{position:"relative"}}>
              <div className='dropSet' style={{zIndex:"4"}} >
                <p>유형</p>
                <Dropdown className="dropset_dd" label="---- 필수 선택 ----">
                  <p className={layoutStyles.subMenuList}>공지사항</p>
                  <p className={layoutStyles.subMenuList}>자료실</p>
                  <p className={layoutStyles.subMenuList}>학습일지</p>
                  <p className={layoutStyles.subMenuList}>FAQ</p>
                  <p className={layoutStyles.subMenuList}>Q&A</p>
                </Dropdown>
              </div>
              <div className='dropSet' style={{zIndex: "2"}}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label="---- 필수 선택 ----">
                  <p className={layoutStyles.subMenuList}>전체</p>
                  <p className={layoutStyles.subMenuList}>소속 그룹</p>
                  <p className={layoutStyles.subMenuList}>관리자</p>
                  <p className={layoutStyles.subMenuList}>강사</p>
                  <p className={layoutStyles.subMenuList}>비공개</p>
                </Dropdown>
              </div>
            </div>
            <div className='r_bottom'>
              <FileUpload></FileUpload>
            <div className='save_box'>
              <button className={`basicBtn tempBtn`}>임시 저장</button>
              <button className='basicBtn saveBtn'>저장</button>
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost