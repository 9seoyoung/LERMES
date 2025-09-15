import React, { useEffect, useId, useState } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList } from '../../../components/ui/UiComp';

function CreatePost() {
  const formId = useId();
  const handleSubmit = (e) => {
    e.preventDefault(); // 새로고침 막음
  };

  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    title: "",
    content:"",
    type: "",
    scope: "",
    detailScope: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;  
    setFormData((prev) => ({
      ...prev,
      [name]: value,   // name 속성(key)에 따라 값 저장
    }));
  };

  const tempSubmit = () => {}
  const saveSubmit = () => {}

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
                <input id={`${formId}_title`}
                  className='formInput' 
                  name='title' 
                  placeholder='제목을 입력하세요.' 
                  value={formData.title} 
                  onChange={handleChange}
                />
              </div>
            </div>
            {/* 본문 */}
            <textarea                 
                id={`${formId}_content`}
                name="content"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.content}
                onChange={handleChange}>
            </textarea>
            <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <FileList files={files} setFiles={setFiles}></FileList>
            </div>
          </div>
          <div className='formArea_R'>
            <div className='selectBoxArea' style={{position:"relative"}}>
              <div className='dropSet' style={{zIndex:"4"}} >
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"공지사항"}))} onCli>공지사항</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"자료실"}))} onCli>자료실</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"학습일지"}))} onCli>학습일지</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"FAQ"}))} onCli>FAQ</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"Q&A"}))} onCli>Q&A</p>
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>
              <div className='dropSet' style={{zIndex: "2"}}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"전체"}))} onCli>전체</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"소속그룹"}))} onCli>소속 그룹</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"관리자"}))} onCli>관리자</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"강사"}))} onCli>강사</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"비공개"}))} onCli>비공개</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div>
              <div className='dropSet' style={{zIndex: "1"}}>
                <p>하위 그룹</p>
                <Dropdown className="dropset_dd" label={formData.detailScope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, detailScope:"변수-기수별"}))} onCli>{"변수"}</p>
                </Dropdown>
                <input type="hidden" name="detailScope" value={formData.scope} />
              </div>
            </div>
            <div className='r_bottom'>
              <FileUpload files={files} setFiles={setFiles}></FileUpload>
            <div className='save_box'>
              <button className={`basicBtn tempBtn`} type='button' onClick={tempSubmit}>임시 저장</button>
              <button className='basicBtn saveBtn' type='button' onClick={saveSubmit}>저장</button>
            </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CreatePost