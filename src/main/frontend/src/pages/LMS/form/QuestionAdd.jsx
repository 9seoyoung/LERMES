// QuestionAdd.jsx
import React, { useEffect } from "react";
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

export default function QuestionAdd({ questions = [], onChange }) {
  // 비어 있으면 첫 질문 하나 자동 생성
  useEffect(() => {
    if (!questions || questions.length === 0) {
      onChange(() => [makeQuestion()]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 액션들 전부 "업데이터 함수" 패턴
  const addQuestion = () =>
      onChange(prev => [...prev, makeQuestion()]);

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

        <button type="button" className="questionAdd" onClick={addQuestion}>
          <Plus strokeWidth={4} />
          <p>질문추가</p>
        </button>
      </>
  );
}
