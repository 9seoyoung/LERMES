import { useReducer } from "react";
import { v4 as uuid } from "uuid";
import { QuestionType } from "./QuestionType";
import { Plus } from "lucide-react";

// 질문 하나의 기본 스키마
const makeQuestion = () => ({
  qid: uuid(),
  type: "single",
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

    case "REMOVE_QUESTION":
      return state.filter((q) => q.qid !== action.qid);

    case "SET_TYPE": {
      const { qid, value } = action; // "single" | "multiple" | "text" | "image"
      return state.map((q) => {
        if (q.qid !== qid) return q;

        // 타입 변경 시 해당 질문 값을 초기화 (qid만 유지)
        const base = {
          qid: q.qid,
          type: value,
          title: "",
          explain: "",
          required: false,
        };

        if (value === "single" || value === "multiple") {
          return {
            ...base,
            options: [
              { id: uuid(), label: "" },
              { id: uuid(), label: "" },
            ],
          };
        }
        // 주관식/이미지
        return { ...base, options: [] };
      });
    }

    case "SET_TITLE":
      return state.map((q) =>
        q.qid === action.qid ? { ...q, title: action.value } : q
      );

    case "SET_EXPLAIN":
      return state.map((q) =>
        q.qid === action.qid ? { ...q, explain: action.value } : q
      );

    case "ADD_OPTION":
      return state.map((q) =>
        q.qid === action.qid
          ? { ...q, options: [...q.options, { id: uuid(), label: "" }] }
          : q
      );

    case "UPDATE_OPTION":
      return state.map((q) =>
        q.qid === action.qid
          ? {
              ...q,
              options: q.options.map((o) =>
                o.id === action.id ? { ...o, label: action.label } : o
              ),
            }
          : q
      );

    case "REMOVE_OPTION":
      return state.map((q) =>
        q.qid === action.qid
          ? { ...q, options: q.options.filter((o) => o.id !== action.id) }
          : q
      );

    default:
      return state;
  }
}

export default function QuestionAdd() {
  const [questions, dispatch] = useReducer(questionsReducer, [makeQuestion()]);
  
  const qNum = 1;
  const addQuestion = () => {
    dispatch({ type: "ADD_QUESTION" });
  };


  return (
    <>
      {questions.map((q) => (
        <QuestionType key={q.qid} q={q} dispatch={dispatch} qNum={qNum}/>
      ))}

      {`현재 문항 수 : ${questions.length}`}
      <button type="button" className="questionAdd" onClick={addQuestion}>
        <Plus color="#0088FF" strokeWidth={4} ></Plus>
        <p>질문추가</p>
      </button>

    </>
  );
}