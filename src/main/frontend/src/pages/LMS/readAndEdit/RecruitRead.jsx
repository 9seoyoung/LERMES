// RecruitRead.jsx
import QuestionRead from './QuestionRead';
import React, { useEffect, useId, useState, useRef } from 'react';
import { FileList } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { v4 as uuidv4 } from 'uuid';
import {
  applyGroup,
  deleteGroup,
  readRecruitPoster,
} from '../../../services/postService';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { formatTime } from '../../../utils/dateformat';
import styles from '../../../styles/form.module.css';

function RecruitRead({ propCohortSn, editToggle, setEditToggle }) {
  const domFormId = useId();
  const { recruitSn } = useParams();
  const finalSn = propCohortSn ?? recruitSn;
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const qAddRef = useRef(null);
  const navigate = useNavigate();
  const scrollRef = useRef(null);
  const [showForm, setShowForm] = useState(true);
  const { pathname } = useLocation();
  const [files, setFiles] = useState([]);

  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  const [formData, setFormData] = useState({
    cohortSn: finalSn,
    id: postId.current,
    userSn: user.USER_SN,
    title: '',
    answer: '',
    groupName: '',
    type: '모집공고',
    content: '',
    scope: [1, 2, 3],
    surveyStart: '',
    surveyEnd: '',
    startDate: '',
    endDate: '',
    place: '',
    classStart: '',
    classEnd: '',
    bigLogoFileSn: null,
    cohortImg: null,
  });

  // --------------------------
  // 모집공고 + 기수 이미지 조회
  // --------------------------
  useEffect(() => {
    (async () => {
      if (!finalSn) return;
      try {
        const res = await readRecruitPoster(finalSn);
        const c = res?.data;
        if (!c) return;

        // 설문 복원
        if (typeof c?.crclmCn === 'string' && c.crclmCn.trim()) {
          try {
            const parsed = JSON.parse(c.crclmCn);
            const pages = Array.isArray(parsed?.pages) ? parsed.pages : [];
            const first = pages[0] ?? { id: uuidv4(), questions: [] };
            setSurveyForm({
              id: parsed?.id ?? postId.current,
              pages: [{ id: first.id, questions: first.questions ?? [] }],
            });
          } catch (err) {
            console.warn('[RecruitRead] crclmCn parse 실패', err);
          }
        }

        // 기본 데이터 세팅
        setFormData((prev) => ({
          ...prev,
          cohortSn: c?.cohortSn ?? prev.cohortSn,
          groupName: c?.cohortNm ?? '',
          title: c?.crclmNm ?? '',
          surveyStart: c?.recruitBgngYmd ?? '',
          surveyEnd: c?.recruitEndYmd ?? '',
          startDate: c?.crclmBgngYmd ?? '',
          endDate: c?.crclmEndYmd ?? '',
          classStart: c?.attendStartTm ?? '',
          classEnd: c?.attendEndTm ?? '',
          place: c?.cohortPl ?? '',
          bigLogoFileSn: c?.bigLogoFileSn ?? null,
          cohortImg: null,
        }));

        // ✅ 기수 이미지 따로 조회
        if (c?.cohortSn) {
          const imgRes = await fetch(
            `http://localhost:940/api/cohorts/${c.cohortSn}`
          );
          if (imgRes.ok) {
            const imgData = await imgRes.json();
            if (imgData?.cohortImg) {
              setFormData((prev) => ({
                ...prev,
                cohortImg: imgData.cohortImg,
              }));
            }
          }
        }

        console.log('[RecruitRead] finalSn =', finalSn, c);
      } catch (err) {
        console.error('[RecruitRead] readRecruitPoster error:', err);
      }
    })();
  }, [finalSn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const saveSubmit = async (e) => {
    e.preventDefault();
    const body = { ...formData, surveyForm };
    try {
      const res = await applyGroup(body);
      console.log('[RecruitRead] applyGroup response:', res);
      toast.success('게시 성공');
      navigate(-1);
    } catch (err) {
      console.error('[RecruitRead] applyGroup error:', err);
      toast.error(err.message);
    }
  };

  return (
    <div className="boardPage">
      <div
        className="BigListBox"
        ref={scrollRef}
        style={{ position: 'relative' }}
      >
        <h2
          style={{ fontWeight: '500', display: 'flex', alignItems: 'baseline' }}
        >
          <span>
            [모집공고] {formData?.title} {formData.groupName}
          </span>
          {pathname === '/adminHome/groupSet' && (
            <button
              type="button"
              className={styles.redBtn}
              onClick={async () => {
                const ok = window.confirm('정말 삭제하시겠습니까?');
                if (!ok) return;
                try {
                  await deleteGroup(finalSn);
                  toast.success('삭제되었습니다.', {
                    onClose: () => window.location.reload(),
                  });
                } catch (err) {
                  toast.error('삭제 중 오류');
                }
              }}
            >
              삭제 [x]
            </button>
          )}
        </h2>

        {showForm ? (
          <div className={styles.explainBox}>
            <div className="selectBoxArea" style={{ position: 'relative' }}>
              <div>
                모집 기간: {formData.surveyStart} - {formData.surveyEnd}
              </div>
              <div>
                교육 기간: {formData.startDate} - {formData.endDate}
              </div>
              <div>
                수업 시간: {formatTime(formData.classStart)} ~{' '}
                {formatTime(formData.classEnd)}
              </div>
              <div>교육 장소: {formData.place}</div>
            </div>

            <img
              src={`http://localhost:940/api/files/id/${
                formData.cohortImg !== null
                  ? formData.cohortImg
                  : formData.bigLogoFileSn
              }/preview`}
              alt="대표 이미지"
              style={{ width: '20%', height: '200px', objectFit: 'cover' }}
            />

            <button
              className={styles.applyBtn}
              type="button"
              onClick={() => setShowForm(!showForm)}
            >
              {pathname === '/adminHome/groupSet'
                ? '미리보기'
                : '신청하러 가기'}
            </button>
          </div>
        ) : (
          <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
            <div className="formArea_L">
              <RecruitForm
                handleChange={handleChange}
                formData={formData}
                setFiles={setFiles}
                surveyForm={surveyForm}
                setSurveyForm={setSurveyForm}
                containerRef={scrollRef}
                questionAddRef={qAddRef}
                saveSubmit={saveSubmit}
                setShowForm={setShowForm}
                showForm={showForm}
                setEditToggle={setEditToggle}
              />
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default RecruitRead;

function RecruitForm({
  handleChange,
  formData,
  setFiles,
  surveyForm,
  setSurveyForm,
  questionAddRef,
  containerRef,
  saveSubmit,
  setShowForm,
  showForm,
  setEditToggle,
}) {
  const qContainerRef = useRef(null);
  return (
    <>
      <div className="formHeader" />
      <div className="formContent" ref={qContainerRef}>
        <QuestionRead
          ref={questionAddRef}
          setFiles={setFiles}
          containerRef={containerRef}
          questions={surveyForm.pages[0].questions}
          saveSubmit={saveSubmit}
          showForm={showForm}
          setShowForm={setShowForm}
          setEditToggle={setEditToggle}
          onChange={(updaterOrQs) => {
            setSurveyForm((prev) => {
              const page = prev.pages[0];
              const nextQs =
                typeof updaterOrQs === 'function'
                  ? updaterOrQs(page.questions)
                  : updaterOrQs;
              return { ...prev, pages: [{ ...page, questions: nextQs }] };
            });
          }}
        />
      </div>
    </>
  );
}
