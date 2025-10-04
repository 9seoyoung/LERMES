// RecruitPost.jsx
import QuestionAdd from './QuestionAdd';

import React, { useEffect, useId, useState, useRef } from 'react';
import {
  FileList,
  FormInput,
  DateTimeInput,
} from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from '../../../services/cohortService';
import { v4 as uuidv4 } from 'uuid';

import { createGroup } from '../../../services/postService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { updateCompanyBigLogo } from '../../../auth/authService';
import { api } from '../../../auth/api';

// CreatePost.jsx
// ...import 생략

function RecruitPost() {
  const domFormId = useId();
  const domId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  // const [loading, setLoading] = useState(false);

  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);

  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  const [formData, setFormData] = useState({
    id: postId.current,
    userSn: user.USER_OGDP_CO_SN, //유저같지만 회사임
    title: '', //과정명
    answer: '', // 신청자 답변
    groupName: '', //그룹명
    type: '모집공고',
    content: '',
    scope: '',
    surveyStart: '', // 모집시작
    surveyEnd: '',
    startDate: '',
    place: '', // 장소
    endDate: '', //  모집종료
    classStart: '', //수업시작시간
    classEnd: '', //수업종료시간
    files: [
      { qid: '', fid: '' },
      { qid: '', fid: '' },
    ],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log('[change]', name, value);
  };

  const tempSubmit = () => {};
  const saveSubmit = async (e) => {
    e.preventDefault();

    // const payload = structuredClone
    //   ? structuredClone({ surveyForm, formData })
    //   : JSON.parse(JSON.stringify({ surveyForm, formData }));

    const snapshot = structuredClone
      ? structuredClone({ surveyForm, formData })
      : JSON.parse(JSON.stringify({ surveyForm, formData }));

    const body = { ...snapshot.formData, surveyForm: snapshot.surveyForm };

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
    console.log('[will send to server]', JSON.stringify(body, null, 2));
    console.table(snapshot.formData);

    console.time('[RecruitPost] createGroup');
    try {
      // const res = await createGroup(payload);
      const res = await createGroup(body);
      // 회사 빅 로고 반영 (fileSn이 있으면만)
      if (bigLogoFileSn) {
        await updateCompanyBigLogo(user.USER_OGDP_CO_SN, bigLogoFileSn);
      }
      console.log(Object.keys(snapshot));
      console.log(Object.keys(snapshot.formData));
      console.log('[RecruitPost] createGroup response:', res);
      toast.success('게시 성공');
      navigate(-1);
    } catch (err) {
      console.error('[RecruitPost] createGroup error:', err);

      if (err.response?.status === 400) {
        toast.error('필수값(모집기간/개강일/종강일)을 입력해주세요.');
      } else {
        toast.error('저장 중 오류가 발생했습니다.');
      }
    }
  };

  useEffect(() => {
    (async () => {
      try {
        const data = await hortlistByCpSn(coSn);
        setHortList(data.data.cohorts);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [coSn]);

  //  =========================== 인호 작성 ===============================
  const [bigLogoFileSn, setBigLogoFileSn] = useState(null);
  const handleBigLogoSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const formDataObj = new FormData();
      formDataObj.append('files', file);
      const uploadRes = await api.post('/files', formDataObj, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      setBigLogoFileSn(uploadRes.data[0].fileSn);
      toast.info('회사 빅 로고 선택됨 (저장 시 반영)');
    } catch (err) {
      toast.error('파일 업로드 실패');
    }
  };
  //  =========================== 인호 작성 ===============================

  return (
    <div className="boardPage">
      <h2>과정 관리</h2>
      <div className="limitedHeightBox" ref={scrollRef}>
        <h4 style={{ fontWeight: '500' }}>{formData.type} 등록하기</h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <RecruitForm
              type={formData.type}
              postId={postId.current}
              domFormId={domFormId}
              handleChange={handleChange}
              formData={formData}
              setFormData={setFormData}
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
            <div className="selectBoxArea" style={{ position: 'relative' }}>
              <FormInput
                labelNm="그룹명"
                type="text"
                name="groupName"
                handleChange={handleChange}
                textType={'그룹명을 입력하세요.'}
                formData={formData}
              ></FormInput>
              <FormInput
                labelNm="교육장소"
                type="text"
                name="place"
                handleChange={handleChange}
                textType={'그룹명을 입력하세요.'}
                formData={formData}
              ></FormInput>
              <DateTimeInput
                labelNm="개강일"
                type="date"
                name="startDate"
                handleChange={handleChange}
                textType={'그룹명을 입력하세요.'}
                formData={formData}
              ></DateTimeInput>
              <DateTimeInput
                labelNm="종강일"
                type="date"
                name="endDate"
                handleChange={handleChange}
                textType={'그룹명을 입력하세요.'}
                formData={formData}
              ></DateTimeInput>
              <DateTimeInput
                labelNm="수업 시작"
                type="time"
                name="classStart"
                handleChange={handleChange}
                textType={'-- : --'}
                formData={formData}
              ></DateTimeInput>
              <DateTimeInput
                labelNm="수업 종료"
                type="time"
                name="classEnd"
                handleChange={handleChange}
                textType={'-- : --'}
                formData={formData}
              ></DateTimeInput>
              {/* 인호 여기에 이미지 삽입 ㄱㄱ */}
              <div
                style={{
                  marginBottom: '16px',
                }}
              >
                <label style={{ display: 'block', fontWeight: '500' }}>
                  회사 빅 로고
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBigLogoSelect}
                  style={{
                    padding: '6px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                  }}
                />
                {bigLogoFileSn && (
                  <img
                    src={`http://localhost:940/api/files/id/${bigLogoFileSn}`}
                    alt="미리보기"
                    style={{
                      marginTop: '30px',
                      border: '1px solid #ddd',
                      width: '100%',
                      height: '90px',
                    }}
                  />
                )}
              </div>
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
                          onClick={() => {
                            // r_bottom 버튼 onClick 직전에 찍어봐
                            console.log(
                              'child root?',
                              qAddRef.current?.focusQuestion ? 'ok' : 'no'
                            );

                            qAddRef.current?.focusQuestion(q.qid, {
                              behavior: 'smooth',
                              offsetTop: 8, // 고정 헤더 있으면 px 조절
                            });
                          }}
                        >
                          {q.title?.trim()
                            ? `Q${i + 1} ${q.title}`
                            : `Q${i + 1} (제목 없음)`}{' '}
                          · {q.type}
                        </button>
                      </li>
                    ))}
                  </React.Fragment>
                ))}
              </ul>
              <div className="save_box">
                <button
                  className="basicBtn tempBtn"
                  type="button"
                  onClick={tempSubmit}
                >
                  임시 저장
                </button>
                <button
                  className="basicBtn saveBtn"
                  type="button"
                  onClick={saveSubmit}
                >
                  저장
                </button>
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
  domFormId,
  handleChange,
  formData,
  setFiles,
  surveyForm,
  setSurveyForm,
  questionAddRef,
  containerRef,
}) {
  // pages[0]이 항상 존재하도록 보장(상위 CreatePost에서 초기화함)
  // const firstPage = surveyForm.pages[0];
  const qContainerRef = useRef(null);

  return (
    <>
      <div className="formHeader">
        <div className="inputSet">
          <label className="formLabel" htmlFor={`${domFormId}_title`}>
            제목
          </label>
          <input
            id={`${domFormId}_title`}
            className="formInput"
            name="title"
            placeholder="과정명을 입력하세요."
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className="inputSet inputFlex1">
          <DateTimeInput
            type="date"
            labelNm="모집기간"
            handleChange={handleChange}
            name="surveyStart"
            formData={formData}
            addStyle="formLabel"
          ></DateTimeInput>
          <DateTimeInput
            type="date"
            labelNm="-"
            handleChange={handleChange}
            name="surveyEnd"
            formData={formData}
          ></DateTimeInput>
        </div>
      </div>

      <div className="formContent" ref={qContainerRef}>
        {/* ☆ 초기 질문 주입 + 변경시 surveyForm 갱신 */}
        <QuestionAdd
          ref={questionAddRef}
          setFiles={setFiles}
          containerRef={containerRef}
          questions={surveyForm.pages[0].questions}
          onChange={(updaterOrQs) => {
            setSurveyForm((prev) => {
              const page = prev.pages[0];
              const nextQs =
                typeof updaterOrQs === 'function'
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
