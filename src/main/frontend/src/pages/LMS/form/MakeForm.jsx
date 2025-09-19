import { useReducer } from "react";
import { v4 as uuid } from "uuid";
import { QuestionType } from "./QuestionType";

// 질문 하나의 기본 스키마
const makeQuestion = () => ({
  qid: uuid(),
  type: "single",     // 기본: 객관식(단일)
  title: "",
  explain: "",
  required: false,
  options: [
    { id: uuid(), label: "" },
    { id: uuid(), label: "" },
  ],
});

// 리듀서
function questionsReducer(state, action) {
  switch (action.type) {
    case "ADD_QUESTION":
      return [...state, makeQuestion()];

    case "SET_TYPE": {
      const { qid, value } = action; // "single" | "multiple" | "text" | "image"
      return state.map(q => {
        if (q.qid !== qid) return q;
        // 타입 전환 시 필드 보정
        if (value === "single" || value === "multiple") {
          return {
            ...q,
            type: value,
            options: q.options?.length ? q.options : [{ id: uuid(), label: "" }],
          };
        }
        // 주관식/이미지 계열이면 options 제거
        return { ...q, type: value, options: [] };
      });
    }

    case "SET_TITLE":
      return state.map(q => (q.qid === action.qid ? { ...q, title: action.value } : q));

    case "SET_EXPLAIN":
      return state.map(q => (q.qid === action.qid ? { ...q, explain: action.value } : q));

    case "ADD_OPTION":
      return state.map(q =>
        q.qid === action.qid
          ? { ...q, options: [...q.options, { id: uuid(), label: "" }] }
          : q
      );

    case "UPDATE_OPTION":
      return state.map(q =>
        q.qid === action.qid
          ? {
              ...q,
              options: q.options.map(o => (o.id === action.id ? { ...o, label: action.label } : o)),
            }
          : q
      );

    case "REMOVE_OPTION":
      return state.map(q =>
        q.qid === action.qid
          ? { ...q, options: q.options.filter(o => o.id !== action.id) }
          : q
      );

    default:
      return state;
  }
}

export default function QuestionAdd() {
  // 초기 하나 생성
  const [questions, dispatch] = useReducer(questionsReducer, [makeQuestion()]);

  const addQuestion = () => {
    dispatch({ type: "ADD_QUESTION" });
  };

  return (
    <>
      <div>질문추가되는지 확인하는 페이지</div>

      {questions.map(q => (
        <QuestionType
          key={q.qid}       // key는 자식에게 전달되지 않음
          q={q}             // 자식은 q만 받게
          dispatch={dispatch}
        />
      ))}

      <button type="button" className="basicBtn" onClick={addQuestion}>
        질문추가
      </button>

      {`현재 문항 수 : ${questions.length}`}
    </>
  );
}