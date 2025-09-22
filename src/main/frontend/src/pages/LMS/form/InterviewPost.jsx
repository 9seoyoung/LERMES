import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import {v4 as uuidv4} from "uuid";
import { createInterview, createInterviewMemo } from '../../../services/postService';

import { DateTimeInput } from '../../../components/ui/UiComp';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


// InterviewPost.jsx

function InterviewPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const userAuth = user.USER_AUTHRT_SN;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [postType, setPostType] = useState("면담신청");

  const [files, setFiles] = useState([]);

  // 일반 게시글
  const [formData, setFormData] = useState({
    __note: "id: 게시글uuid, userSn: 작성자 유저SN, itvAplyTtl: 제목, itvAplyCn: textarea 내용, type: 면담신청 or 면담요청 or 면담기록, itvPicAuthrt: 공개범위, interviewDate: 면담확정일, interviewTime: 면담예정시간, author: 작성자 유저이름, mento: 담당자, comment: 수신측 기타요청메모",
    formUuid: postId.current,
    userSn: user.USER_SN,
    itvAplyTtl: "",
    itvAplyCn: "",
    type: postType,
    itvPicAuthrt: "", //공개범위
    interviewDate: "",     // 면담확정일
    interviewTime: "", //면담예정시간
    author: user?.USER_NM, // 작성자
    mento: "-", // 담당자
    place: "", //장소
    comment: "", //기타 요청(수신측)
    files: files
  });

  useEffect(() => {
    setFormData({
      __note: "id: 게시글uuid, userSn: 작성자 유저SN, itvAplyTtl: 제목, itvAplyCn: textarea 내용, type: 면담신청 or 면담요청 or 면담기록, scope: 공개범위, interviewDate: 면담확정일, interviewTime: 면담예정시간, author: 작성자 유저이름, mento: 담당자, comment: 수신측 기타요청메모",
      formUuid: postId.current,
      userSn: user.USER_SN,
      itvAplyTtl: "",
      itvAplyCn: "",
      type: postType,
      itvPicAuthrt: "",
      interviewDate: "",     // 면담확정일
      interviewTime: "", //면담예정시간
      author: user?.USER_NM, // 작성자
      mento: "-", // 담당자
      place: "", //장소
      comment: "" //기타 요청(수신측)
    });
    console.log("게시글 유형 변경", formData)
  },[formData.type])


  const handleChange = (e) => {

    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tempSubmit = () => {};
  const saveSubmit = async (e) => {
    e.preventDefault();

  // const payload = structuredClone
  //   ? structuredClone({ surveyForm, formData })
  //   : JSON.parse(JSON.stringify({ surveyForm, formData }));

  const snapshot = structuredClone
    ? structuredClone({ formData })
    : JSON.parse(JSON.stringify({ formData }));

    const body = { ...snapshot.formData };
    console.log("[will send to server]", JSON.stringify(body, null, 2));
    console.table(snapshot.formData);
    console.time("[RecruitPost] createGroup");

   try {
    // const res = await createGroup(payload);
    const res = await createInterview(body);
    toast.success("신청등록 되었습니다.")
    console.log(Object.keys(snapshot)); 
    console.log(Object.keys(snapshot.formData));
    console.log("[RecruitPost] createGroup response:", res);
  } catch (err) {
    console.error("[RecruitPost] createGroup error:", err);
  }
};


  return (
    <div className="boardPage">
      <h2>수강생 관리</h2>
      <div className="limitedHeightBox" style={{height: "706px"}}>
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기</h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            {formData?.type === "면담신청" ?
              <InterviewForm
                  type={formData.type}
                  postId={postId.current}
                  domFormId={domFormId}
                  handleChange={handleChange}
                  formData={formData}
                  FileList={FileList}
                  files={files}
                  setFiles={setFiles}
              />
              :
              <InterviewMemo
                  type={formData.type}
                  postId={postId.current}
                  domFormId={domFormId}
                  handleChange={handleChange}
                  formData={formData}
                  FileList={FileList}
                  files={files}
                  setFiles={setFiles}
              />
            }
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div className="dropSet" style={{ zIndex: "8" }}>
                <p>유형</p>
                <Dropdown className="dropset_dd" label={postType|| "---- 필수 선택 ----"}>
                  {(userAuth === 4 || userAuth === 5) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => {
                                                                              setPostType("면담신청");
                                                                              setFormData(s => ({ ...s, type: postType }));
                                                                              }}>면담신청</p>
                      <p className={layoutStyles.subMenuList} onClick={() => {
                                                                                setPostType("면담기록");
                                                                                setFormData(s => ({ ...s, type: postType }));
                                                                              }}>면담기록</p>
                    </>
                  ) : ""}
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>
              {formData.type === "면담신청" ? 
              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.itvPicAuthrt || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "대표" }))}>대표</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, itvPicAuthrt: "직원" }))}>직원</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.itvPicAuthrt} />
              </div> 
              :
              null}
            </div>

            <div className="r_bottom">
              <FileUpload files={files} setFiles={setFiles} />
              <div className="save_box">
                <button className="basicBtn tempBtn" type="button" onClick={tempSubmit}>임시 저장</button>
                <button className="basicBtn saveBtn" type="button" onClick={() => {
                                                                                    saveSubmit();
                                                                                    navigate('/stdHome/studySched');
                                                                                  }}>{loading ? "저장 중..." : "저장"}</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default InterviewPost;


function InterviewForm({
  domFormId, handleChange, formData, files, formId, setFiles,
}) {

  return (
    <>
      <div className='formHeader'>
        <div className='inputSet inputTitleSet'>
          <label className='formLabel' htmlFor={`${domFormId}_title`}>제목</label>
          <input
            id={`${domFormId}_title`}
            className='formInput'
            name='title'
            placeholder='제목을 입력하세요.'
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className='inputSet inputFlex1'>
          <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
          <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="menoto" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
        </div>
      </div>

      <div className="formContent">
            <textarea                 
                id={`${formId}_content`}
                name="content"
                className='formTextarea'
                placeholder='본문을 입력하세요.'
                value={formData.content}
                onChange={handleChange}>
            </textarea>
            <div className='inputSet'>
          </div>
          <div className='inputSet'>
            <div className='inputSet inputFlex1'>
              <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
              <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
              <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
              <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
              
            </div>
          </div>
          <div className='inputSet'>
              <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
              <FileList files={files} setFiles={setFiles}></FileList>
          </div>
      </div>
      </>
  );
}

function InterviewMemo({
  domFormId, handleChange, formData, files, formId, setFiles,
}) {
  return (
  <>
  <div className='formHeader'>
    <div className='inputSet inputTitleSet'>
      <label className='formLabel' htmlFor={`${domFormId}_title`}>제목</label>
        <input
          id={`${domFormId}_title`}
          className='formInput'
          name='title'
          placeholder='제목을 입력하세요.'
          value={formData.title}
          onChange={handleChange}
        />
      </div>

      <div className='inputSet inputFlex1'>
        <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
        <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="menoto" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
      </div>
    </div>

    <div className="formContent">
          <textarea                 
              id={`${formId}_content`}
              name="content"
              className='formTextarea'
              placeholder='본문을 입력하세요.'
              value={formData.content}
              onChange={handleChange}>
          </textarea>
          <div className='inputSet'>
        </div>
        <div className='inputSet'>
          <div className='inputSet inputFlex1'>
            <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
            <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
            <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
            <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
            
          </div>
        </div>
        <div className='inputSet'>
            <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
            <FileList files={files} setFiles={setFiles}></FileList>
        </div>
    </div>
  </>
  );
}