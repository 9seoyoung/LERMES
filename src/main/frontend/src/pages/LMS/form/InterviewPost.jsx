import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from "../../../services/cohortService"; //서비스 나중에 교체 ㄱㄱ
import {v4 as uuidv4} from "uuid";
import { createPost } from '../../../services/postService';

import { DateTimeInput } from '../../../components/ui/UiComp';


// InterviewPost.jsx

function InterviewPost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const userAuth = user.USER_AUTHRT_SN;
  const qAddRef = useRef(null);
  const scrollRef = useRef(null);
  // const [loading, setLoading] = useState(false);

  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);

  // 일반 게시글
  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_SN,
    title: "",
    content: "",
    type: "",
    scope: "",
    detailScope: "",
    detailScopeNm: "",
    surveyStart: "",     // 설문조사
    surveyEnd: "",   // 설문조사
  });


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

  // console.groupCollapsed("[RecruitPost] createGroup payload");
  // console.table(
  //   payload.surveyForm?.pages?.[0]?.questions?.map((q, i) => ({
  //     idx: i + 1, qid: q.qid, type: q.type,
  //     title: q.title || "(제목 없음)", options: q.options?.length ?? 0,
  //   })) || []
  // );
  // console.groupEnd();

  // console.log("[payload snapshot]", snapshot);
  // console.log("[formData]", snapshot.formData);
  // console.log("[surveyForm]", snapshot.surveyForm);
  console.log("[will send to server]", JSON.stringify(body, null, 2));
  console.table(snapshot.formData);

  console.time("[RecruitPost] createGroup");
  try {
    // const res = await createGroup(payload);
    const res = await createPost(body);
    console.log(Object.keys(snapshot)); 
    console.log(Object.keys(snapshot.formData));
    console.log("[RecruitPost] createGroup response:", res);
  } catch (err) {
    console.error("[RecruitPost] createGroup error:", err);
  }
};

  useEffect(() => {
    (async () => {
      try {
        const data = await hortlistByCpSn(coSn);
        setHortList(data.data);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [coSn]);

  return (
    <div className="boardPage">
      <h2>수강생 관리</h2>
      <div className="limitedHeightBox" style={{height: "706px"}}>
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기</h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <InterviewForm
                type={formData.type}
                postId={postId.current}
                domFormId={domFormId}
                handleChange={handleChange}
                formData={formData}
                FileList={FileList}
                files={files}
                setFiles={setFiles}
                containerRef={scrollRef}
                questionAddRef={qAddRef}
            />
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div className="dropSet" style={{ zIndex: "8" }}>
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type || "---- 필수 선택 ----"}>
                  {(userAuth === 2 || userAuth === 3) ?
                      <>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "자료실" }))}>자료실</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "설문조사" }))}>설문조사</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "FAQ" }))}>FAQ</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "일정" }))}>일정</p>
                        <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담기록" }))}>면담기록</p>
                      </>
                  : ""}
                  {(userAuth === 4 || userAuth === 5) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담기록" }))}>면담기록</p>
                    </>
                  ) : ""}
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>
              {formData.type === "면담신청" ? 
              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "대표" }))}>대표</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "직원" }))}>직원</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div> 
              :
              null}
            </div>

            <div className="r_bottom">
              <FileUpload files={files} setFiles={setFiles} />
              <div className="save_box">
                <button className="basicBtn tempBtn" type="button" onClick={tempSubmit}>임시 저장</button>
                <button className="basicBtn saveBtn" type="button" onClick={saveSubmit}>저장</button>
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
  // pages[0]이 항상 존재하도록 보장(상위 CreatePost에서 초기화함)
  // const firstPage = surveyForm.pages[0];
  const qContainerRef = useRef(null);

  return (
    <>
      <div className='formHeader'>
        <div className='inputSet'>
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
          <DateTimeInput type="date" labelNm="작성자" handleChange={handleChange} name="surveyStart" formData={formData} addStyle="formLabel"></DateTimeInput>
          <DateTimeInput type="date" labelNm="담당자" handleChange={handleChange} name="surveyEnd" formData={formData} addStyle="formLabel" ></DateTimeInput>
        </div>
      </div>

      <div className="formContent" ref={qContainerRef}>
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
              <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addStyle="formLabel"></DateTimeInput>
              <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addStyle="formLabel" ></DateTimeInput>
              <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addStyle="formLabel"></FormInput>
              <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addStyle="formLabel" ></FormInput>
              
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