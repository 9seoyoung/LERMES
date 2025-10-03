// RecruitRead.jsx
import QuestionRead from "./QuestionRead"; 

import React, { useEffect, useId, useState, useRef } from 'react'
import {FileList, FormInput, DateTimeInput } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { hortlistByCpSn } from "../../../services/cohortService";
import {v4 as uuidv4} from "uuid";

import { applyGroup, readRecruitPoster } from '../../../services/postService';
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { formatTime } from "../../../utils/dateformat";
import styles from "../../../styles/form.module.css";

// CreatePost.jsx
// ...import 생략

function RecruitRead() {
  const domFormId = useId();
  const {recruitSn} = useParams();
  const domId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showForm, setShowForm] = useState(false);
  
  const [files, setFiles] = useState([]);
  
  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });
  
  const [formData, setFormData] = useState({
    cohortSn: recruitSn,
    id: postId.current,
    userSn: user.USER_SN, //유저같지만 회사임
    title: "", //과정명
    answer: "", // 신청자 답변
    groupName: "", //그룹명
    type: "모집공고",
    content: "",
    scope: [1, 2, 3],
    surveyStart: "",     // 모집시작
    surveyEnd: "",
    startDate:"",
    place: "", // 장소
    endDate:"",   //  모집종료
    classStart: "", //수업시작시간
    classEnd: "", //수업종료시간
    files: [{qid: "", fid: ""}, {qid: "", fid: ""}]
  });
  
  
  useEffect(() => {
    (async () => {
      if (!recruitSn) return;
      try {
        const res = await readRecruitPoster(recruitSn);
        const c = res?.data;
  
      // 설문 복원 crclmCn(JSON 문자열) >> surveyForm
      if (typeof c?.crclmCn === "string" && c.crclmCn.trim()) {
        try {
          const parsed = JSON.parse(c.crclmCn); // { id, pages: [{ id, questions: [...] }] }
          const pages = Array.isArray(parsed?.pages) ? parsed.pages : [];
          const first = pages[0] ?? { id: crypto.randomUUID?.() ?? "page-1", questions: [] };
            // 옵션/타입 정규화 (최소 2개 옵션 보장, type 정상화)
          const normalize = (q) => {
            const base = { ...q };
            // 허용 타입만 유지
            const allowed = new Set(["single", "multiple", "text", "image"]);
            if (!allowed.has(base.type)) base.type = "single";
            // 선택형이면 옵션 최소 2개
            if (base.type === "single" || base.type === "multiple") {
              const opts = Array.isArray(base.options) ? base.options : [];
              const withIds = opts.map(o => ({ id: o.id ?? crypto.randomUUID?.() ?? String(Math.random()), label: o.label ?? "" }));
              while (withIds.length < 2) withIds.push({ id: crypto.randomUUID?.() ?? String(Math.random()), label: "" });
              base.options = withIds;
            } else {
              base.options = [];
            }
            // 필드 기본값
            base.qid = base.qid ?? (crypto.randomUUID?.() ?? String(Math.random()));
            base.title = base.title ?? "";
            base.explain = base.explain ?? "";
            base.answer = base.answer ?? "";
            base.required = !!base.required;
            return base;
          };
            const restoredQs = Array.isArray(first.questions)
            ? first.questions.map(normalize)
            : [];
            setSurveyForm(prev => ({
            id: parsed?.id ?? prev.id,                 // 원래 id 유지 or JSON의 id
            pages: [{ id: first.id, questions: restoredQs }],
          }));
        } catch (e) {
          console.warn("[RecruitRead] crclmCn JSON parse 실패:", e);
        }
      }
  
        setFormData(prev => ({
          ...prev,
          content:     c?.crclmCn ?? "", 
          groupName:   c?.cohortNm ?? "",
          answer:      c?.answer ?? "",
          title:       c?.crclmNm ?? "",
          surveyStart: c?.recruitBgngYmd ?? c?.recruitBgngDt ?? "",
          surveyEnd:   c?.recruitEndYmd   ?? c?.recruitEndDt   ?? "",
          startDate:   c?.crclmBgngYmd ?? c?.crclmBgngDt ?? "",
          endDate:     c?.crclmEndYmd  ?? c?.crclmEndDt  ?? "",
          classStart:  c?.attendStartTm ?? "",
          classEnd:    c?.attendEndTm   ?? "",
          place:       c?.cohortPl ?? "",
        }));
        console.log("[RecruitRead] recruitSn =", recruitSn, c);
      } catch (e) {
        console.log("[RecruitRead] read error:", e?.message, e);
      }
    })();
  }, [recruitSn]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    console.log("[change]", name, value);
  };

// 응답 요약을 사람이 읽기 좋은 문자열로 합치기
const flattenAnswers = (answersMap) => {
  const parts = [];
  for (const [qid, v] of Object.entries(answersMap || {})) {
    if (!v) continue;
    // single: {id, label}
    if (v && typeof v === "object" && "label" in v && "id" in v) {
      parts.push(v.label);
      continue;
    }
    // multiple: [{id,label}, ...]
    if (Array.isArray(v)) {
      const labels = v.map(x => x?.label).filter(Boolean).join(", ");
      if (labels) parts.push(labels);
      continue;
    }
    // text/image: { text: "..." }
    if (v && typeof v === "object" && "text" in v) {
      if (v.text?.trim()) parts.push(v.text.trim());
      continue;
    }
  }
  return parts.join(" | ");
};


const buildAnswersMap = (surveyForm) => {
  const out = {};
  for (const p of surveyForm.pages || []) {
    for (const q of p.questions || []) {
      if (q.type === "single") out[q.qid] = q.answer ? { ...q.answer } : null;
      else if (q.type === "multiple") out[q.qid] = (q.selected || []).map(x => ({ ...x }));
      else out[q.qid] = { text: q.answerText ?? "" };
    }
  }
  return out;
};
  const saveSubmit = async (e) => {
   e.preventDefault();

  const snapshot = structuredClone
    ? structuredClone({ surveyForm, formData })
    : JSON.parse(JSON.stringify({ surveyForm, formData }));

  const answersMap = buildAnswersMap(snapshot.surveyForm);
  const flatAnswer = flattenAnswers(answersMap); // ★ 요약 문자열 생성


  const body = { ...snapshot.formData, answer: flatAnswer, surveyForm: snapshot.surveyForm,  surveyAnswers: answersMap };

  console.log("[will send to server]", JSON.stringify(body, null, 2));
  console.table(snapshot.formData);

  console.time("[RecruitRead] readRecruitPoster");
  try {
    const res = await applyGroup(body);
    console.log(Object.keys(snapshot)); 
    console.log(Object.keys(snapshot.formData));
    console.log("[RecruitRead] readRecruitPoster response:", res);
    toast.success("게시 성공");
    navigate(-1);
  } catch (err) {
    console.error("[RecruitRead] readRecruitPoster error:", err);
    toast.error(err.message);
  }
};



  return (
    <div className="boardPage">
      <div className="BigListBox" ref={scrollRef} style={{position: "relative"}}>
        <h2 style={{ fontWeight: "500" }}>[모집공고] {formData?.title} {formData.groupName}</h2>
        {showForm ? 
            <>
        <div className={styles.explainBox}>
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div> 모집 기간: {formData.surveyStart} - {formData.surveyEnd}</div>
              <div> 교육 기간: {formData.startDate} - {formData.endDate}</div>
              <div> 수업 시간: {formatTime(formData.classStart)} ~ {formatTime(formData.classEnd)}</div>
              <div> 교육 장소: {formData.place}</div>
            </div>
            <img src="940:"></img>
            <button className={styles.applyBtn} type="button" onClick={() => setShowForm(!showForm)}>신청하러 가기</button>
        </div>
        </>
        :
        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
            <button className={styles.applyBtn} type="button" onClick={() => setShowForm(!showForm)}>임시 닫기</button>

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
                saveSubmit={saveSubmit}
            />
          </div>
        </form>
          }
      </div>
    </div>
  );
}

export default RecruitRead;


function RecruitForm({
  domFormId, handleChange, formData, setFiles,
  surveyForm, setSurveyForm, questionAddRef, containerRef ,saveSubmit
}) {
  // pages[0]이 항상 존재하도록 보장(상위 CreatePost에서 초기화함)
  // const firstPage = surveyForm.pages[0];
  const qContainerRef = useRef(null);

  return (
    <>
      <div className='formHeader'>
        
      </div>

      <div className="formContent" ref={qContainerRef}>
        {/* ☆ 초기 질문 주입 + 변경시 surveyForm 갱신 */}
          <QuestionRead
              ref={questionAddRef}
              setFiles = {setFiles}
              containerRef={containerRef}
              questions={surveyForm.pages[0].questions}
              saveSubmit={saveSubmit}
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
              <ul style={{position: "fixed", background: "var(--color-table-bg)", right: "0", padding: "16px 12px", display: 'flex', gap: "8px", flexDirection: "column"}}>
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
                                console.log('child root?', questionAddRef.current?.focusQuestion ? 'ok' : 'no');

                                questionAddRef.current?.focusQuestion(q.qid, {
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
    </>
  );
}
