// RecruitPost.jsx
import QuestionAdd from "./QuestionAdd"; 

import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList, FormInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from "../../../services/cohortService";
import {v4 as uuidv4} from "uuid";

import { createSurvey } from '../../../services/postService';


// CreatePost.jsx
// ...import 생략

function RecruitPost() {
  const domFormId = useId();
  const domId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const qAddRef = useRef(null);
    const scrollRef = useRef(null);
  // const [loading, setLoading] = useState(false);

  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);

  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  // 일반 게시글
  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_SN,
    title: "",
    content: "",
    groupName: "",
    type: "모집공고",
    scope: "전체",
    surveyStart: "",     // 모집시작
    surveyEnd: "",   //  모집종료
    classStart: "", //수업시작시간
    classEnd: "", //수업종료시간
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tempSubmit = () => {};
  const saveSubmit = async (e) => {
    e.preventDefault();

  const payload = structuredClone
    ? structuredClone({ surveyForm, formData })
    : JSON.parse(JSON.stringify({ surveyForm, formData }));

  console.groupCollapsed("[RecruitPost] createSurvey payload");
  console.table(
    payload.surveyForm?.pages?.[0]?.questions?.map((q, i) => ({
      idx: i + 1, qid: q.qid, type: q.type,
      title: q.title || "(제목 없음)", options: q.options?.length ?? 0,
    })) || []
  );
  console.groupEnd();

  console.time("[RecruitPost] createSurvey");
  try {
    const res = await createSurvey(payload);
    console.log("[RecruitPost] createSurvey response:", res);
  } catch (err) {
    console.error("[RecruitPost] createSurvey error:", err);
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
      <h2>과정 관리</h2>
      <div className="limitedHeightBox" ref={scrollRef}>
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기</h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <RecruitForm
                type={formData.type}
                postId={postId.current}
                domFormId={domFormId}
                handleChange={handleChange}
                formData={formData}
                surveyForm={surveyForm}
                setSurveyForm={setSurveyForm}
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
                <p>그룹명</p>
                <FormInput type="text" name="groupName" handleChange={handleChange} textType={"그룹명을 입력하세요."} formData={formData}></FormInput>
              </div>

              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "전체" }))}>전체</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "소속그룹" }))}>소속그룹</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "관리자" }))}>관리자</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "강사" }))}>강사</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "비공개" }))}>비공개</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div>

              {formData.scope === "소속그룹" && (
                <div className="dropSet" style={{ zIndex: "1" }}>
                  <p>하위 그룹</p>
                  <Dropdown className="dropset_dd" label={formData.detailScopeNm || "---- 필수 선택 ----"}>
                    {hortlist.map((h, idx) => (
                      <p
                        className={layoutStyles.subMenuList}
                        key={idx}
                        onClick={() => {
                          setFormData(s => ({ ...s, detailScope: h.cohortSn, detailScopeNm: String(h.cohortNm) }));

                        }}
                      >
                        {h.cohortNm}
                      </p>
                    ))}
                  </Dropdown>
                  <input type="hidden" name="detailScope" value={formData.detailScope} />
                </div>
              )}
            </div>

            <div className="r_bottom">
              <ul>
                {surveyForm.pages.map((page) => (
                    <React.Fragment key={page.id}>
                      {page.questions.map((q, i) => (
                          <li key={q.qid}>
                            <button
                              type="button"
                              className="specificBtn"
                              onClick={() =>
                              {
                                // r_bottom 버튼 onClick 직전에 찍어봐
                                console.log('child root?', qAddRef.current?.focusQuestion ? 'ok' : 'no');

                                qAddRef.current?.focusQuestion(q.qid, {
                                behavior: "smooth",
                                offsetTop: 8, // 고정 헤더 있으면 px 조절
                              })}}
                            >
                              {q.title?.trim()
                              ? `Q${i + 1} ${q.title}`
                              : `Q${i + 1} (제목 없음)`} · {q.type}
                            </button>
                          </li>
                      ))}
                    </React.Fragment>
                ))}
              </ul>
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

export default RecruitPost;


function RecruitForm({
  domFormId, handleChange, formData,
  surveyForm, setSurveyForm, questionAddRef, containerRef 
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
          <label className='formLabel' htmlFor={`${domFormId}_surveyPeriod`}>모집기간</label>
          <input
            id={`${domFormId}_surveyStart`}
            type="date"
            className='formInput'
            name='surveyStart'
            value={formData.surveyStart || ""}
            onChange={handleChange}
          />
          <p>-</p>
          <input
            id={`${domFormId}_surveyEnd`}
            type="date"
            className='formInput'
            name='surveyEnd'
            value={formData.surveyEnd || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="formContent" ref={qContainerRef}>
        {/* ☆ 초기 질문 주입 + 변경시 surveyForm 갱신 */}
          <QuestionAdd
              ref={questionAddRef}
              containerRef={containerRef}
              questions={surveyForm.pages[0].questions}
              onChange={(updaterOrQs) => {
                  setSurveyForm(prev => {
                      const page = prev.pages[0];
                      const nextQs = typeof updaterOrQs === 'function'
                          ? updaterOrQs(page.questions)
                          : updaterOrQs;
                      return {
                          ...prev,
                          pages: [{ ...page, questions: nextQs }, ...prev.pages.slice(1)],
                      };
                  });
              }}
          />
      </div>
    </>
  );
}
