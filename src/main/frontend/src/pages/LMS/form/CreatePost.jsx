import React, { useEffect, useId, useState } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { ArticlePost } from './ArticlePost';
import { hortlistByCpSn } from "../../../services/cohortService";

function CreatePost() {
  const formId = useId();
  const {user} = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const userAuth = user.USER_AUTHRT_SN;
  const [hortlist, setHortList] = useState([]);
  const [groupFilter, setGroupFilter] = useState(null)
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

  useEffect(() => {
      (async () => {
        try {
          // console.log(coSn);
          // console.log(`>>>>>>>>>>>>>>>hortlistByCpSn(회사별 모집공고 리스트) 호출`)
          const data = await hortlistByCpSn(coSn);
          // console.log(`<<<<<<<<<<<<<<< 반환 ${data.data}`)
          setHortList(data.data);
          // console.log(data.data.map((value, idx)=> `${value.cohortNm} + ${idx}`))
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, []);


  return (
    <div className="boardPage">
      <h2>게시판</h2>
      <div className="BigListBox">
        <h4 style={{fontWeight: "400"}}>게시글 등록하기</h4>
        <form className='formAreaRow' onSubmit={handleSubmit}>
          <div className='formArea_L'>
            <ArticlePost formId={formId} handleChange={handleChange} formData={formData} FileList={FileList} files={files} setFiles={setFiles} ></ArticlePost>
          </div>
          <div className='formArea_R'>
            <div className='selectBoxArea' style={{position:"relative"}}>
              <div className='dropSet' style={{zIndex:"4"}} >
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type || "---- 필수 선택 ----"}>
                  {userAuth === 2 || userAuth === 3}
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"공지사항"}))} >공지사항</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"자료실"}))} >자료실</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"설문조사"}))} >설문조사</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"FAQ"}))} >FAQ</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"일정"}))} >일정</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"면담기록"}))} >면담 기록</p>
                  {(userAuth === 4 || userAuth === 5 )?
                  <>
                    <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"학습일지"}))} >학습일지</p>
                    <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"문의"}))} >문의</p>
                    <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, type:"면담신청"}))} >면담 신청</p>
                  </> : ""}
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>
              <div className='dropSet' style={{zIndex: "2"}}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"전체"}))} >전체</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"소속그룹"}))} >소속 그룹</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"관리자"}))} >관리자</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"강사"}))} >강사</p>
                  <p className={layoutStyles.subMenuList} onClick={()=>setFormData(s=>({...s, scope:"비공개"}))} >비공개</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div>
              {formData.scope === "소속그룹" ? 
              <div className='dropSet' style={{zIndex: "1"}}>
                <p>하위 그룹</p>
                <Dropdown className="dropset_dd" label={formData.detailScope || "---- 필수 선택 ----"}>
                  { hortlist.map((hortlist, idx) => (
                  <p className={layoutStyles.subMenuList} key={idx} onClick={()=>setFormData(s=>({...s, detailScope:`${hortlist.cohortNm}`}))} >{hortlist.cohortNm}</p>
                ))}
                </Dropdown>
                <input type="hidden" name="detailScope" value={formData.scope} />
              </div>
              :
              <></>}
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


export function PostStatus({type}){
  const component = <ArticlePost/>;

  switch (type){
    case "공지사항":
      return <ArticlePost />
      break;
    case "자료실":
    return <ArticlePost />
    break;
    case "학습일지":
      return <ArticlePost />
      break;
    case "FAQ":
      return <ArticlePost />
      break;
    case "공지사항":
      return <ArticlePost />
      break;
  }

  return
}