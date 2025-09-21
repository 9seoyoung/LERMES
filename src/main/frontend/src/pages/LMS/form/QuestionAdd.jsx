// QuestionAdd.jsx
import React, {
  forwardRef, useRef, useImperativeHandle, createRef, useEffect
} from "react";
import { v4 as uuid } from "uuid";
import { Plus } from "lucide-react";
import QuestionType from "./QuestionType";

// 질문 하나의 기본 스키마
export const makeQuestion = () => ({
  qid: uuid(),
  type: "single",       // "single" | "multiple" | "text" | "image"
  title: "",
  explain: "",
  required: false,
  options: [
    { id: uuid(), label: "" },
    { id: uuid(), label: "" },
  ],
  answer: "",
});

// 옵션 2개 보장
const ensureOptions = (opts = []) => {
  const next = (opts || []).map(o => ({ id: o.id || uuid(), label: o.label ?? "" }));
  while (next.length < 2) next.push({ id: uuid(), label: "" });
  return next;
};

// export default function QuestionAdd({ questions = [], onChange }) {
const QuestionAdd = forwardRef(function QuestionAdd({ questions = [], onChange, containerRef }, ref) {
  const itemRefs = useRef({});
  const pendingFocusId = useRef(null);

  const getRef = (qid) => {
    if (!itemRefs.current[qid]) itemRefs.current[qid] = createRef();
    return itemRefs.current[qid];
  };

function scrollToChild(container, el, { offsetTop = 0, offsetLeft = 0, behavior = "smooth" } = {}) {
    const cRect = container.getBoundingClientRect();
    const eRect = el.getBoundingClientRect();
    const top  = (eRect.top  - cRect.top)  + container.scrollTop  - offsetTop;
    const left = (eRect.left - cRect.left) + container.scrollLeft - offsetLeft;
    container.scrollTo({ top: Math.round(top), left: Math.round(left), behavior });
  }


  // 비어 있으면 첫 질문 하나 자동 생성
  useEffect(() => {
    if (!questions || questions.length === 0) {
      onChange(() => [makeQuestion()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 액션들 전부 "업데이터 함수" 패턴
  // const addQuestion = () =>
  //     onChange(prev => [...prev, makeQuestion()]);

  const addQuestionAndFocus = () => {
    const newQ = makeQuestion();
    pendingFocusId.current = newQ.qid;
    onChange(prev => [...prev, newQ]);
  };

  // 렌더 후 포커스 처리와 ref GC
  useEffect(() => {
    const alive = new Set(questions.map(q => q.qid));
    Object.keys(itemRefs.current).forEach((id) => {
      if (!alive.has(id)) delete itemRefs.current[id];
    });
    const target = pendingFocusId.current;
    if (target && itemRefs.current[target]?.current) {
      itemRefs.current[target].current.focus?.();
      pendingFocusId.current = null;
    }
  }, [questions]);

  //부모에서 호출 가능한 명령형 API
  useImperativeHandle(ref, () => ({
    // focusQuestion(qid) {
    //   itemRefs.current[qid]?.current?.focus?.();
    // },
    // addQuestionAndFocus,
    /** 외부에서 qid로 정확히 이동 */
    focusQuestion(qid, opts = {}) {
      const container =
        containerRef?.current ??
        document.scrollingElement ??
        document.documentElement;
      const child = itemRefs.current[qid]?.current?.getRoot?.();
      if (!container || !child) return;
      scrollToChild(container, child, opts);
      // 위치 고정 후 포커스 (스크롤 안 바꾸도록)
      setTimeout(() => itemRefs.current[qid]?.current?.focusTitle?.(), 0);
    },
    addQuestionAndFocus(opts = {}) {
      const newQ = makeQuestion();
      pendingFocusId.current = newQ.qid;
      onChange(prev => [...prev, newQ]);
      // 렌더 완료 후 정확 좌표로 이동+포커스
      requestAnimationFrame(() => {
        const id = pendingFocusId.current;
        if (!id) return;
        pendingFocusId.current = null;
        this.focusQuestion?.(id, opts);
      });
    },
  }));

  const removeQuestion = (qid) =>
      onChange(prev => prev.filter(q => q.qid !== qid));

  const setType = (qid, value) =>
      onChange(prev => prev.map(q => {
        if (q.qid !== qid) return q;
        if (value === "single" || value === "multiple") {
          return { ...q, type: value, options: ensureOptions(q.options), answer: "" };
        }
        // text/image는 옵션 비움
        return { ...q, type: value, options: [], answer: "" };
      }));

  const setTitle = (qid, title) =>
      onChange(prev => prev.map(q => q.qid === qid ? ({ ...q, title }) : q));

  const setExplain = (qid, explain) =>
      onChange(prev => prev.map(q => q.qid === qid ? ({ ...q, explain }) : q));

  const addOption = (qid) =>
      onChange(prev => prev.map(q =>
          q.qid === qid ? ({ ...q, options: [...q.options, { id: uuid(), label: "" }] }) : q
      ));

  const updateOption = (qid, id, label) =>
      onChange(prev => prev.map(q =>
          q.qid === qid
              ? ({ ...q, options: q.options.map(o => o.id === id ? { ...o, label } : o) })
              : q
      ));

  const removeOption = (qid, id) =>
      onChange(prev => prev.map(q =>
          q.qid === qid
              ? ({ ...q, options: q.options.filter(o => o.id !== id) })
              : q
      ));

  return (
      <>
        <div className="questionContainer">
          {questions.map((q, idx) => (
              <QuestionType
                  key={q.qid}
                  q={q}
                  ref={getRef(q.qid)}
                  qNum={idx + 1}
                  onRemoveQuestion={removeQuestion}
                  onSetType={setType}
                  onSetTitle={setTitle}
                  onSetExplain={setExplain}
                  onAddOption={addOption}
                  onUpdateOption={updateOption}
                  onRemoveOption={removeOption}
              />
          ))}
        </div>

        <button type="button" className="questionAdd" onClick={() => ref?.current?.addQuestionAndFocus?.()}>
          <Plus color="#0088FF" strokeWidth={4} />
          <p>질문추가</p>
        </button>
      </>
  );
});

export default QuestionAdd;   