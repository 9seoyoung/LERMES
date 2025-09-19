import { forwardRef } from "react";
import FilePreview from "../../../components/ui/FilePreview";
import { DeleteBtn } from "../../../components/ui/UiComp";
import Dropdown from "../../../components/ui/Dropdown";

export const QuestionType = forwardRef(function QuestionType({ q, dispatch }, ref) {
  const setType = (t) => dispatch({ type: "SET_TYPE", qid: q.qid, value: t });

  const changeTypeName = (value) => {
    switch (value){
      case "single":
        return "객관식";

      case "text":
        return "주관식";

      case "image":
        return "이미지";
        
      default:
        return "객관식"
    }
  }

  return (
    <div ref={ref} className="questionBox">
      <div className="questionTypeBox">
        <p>질문 유형</p>
      <Dropdown label={changeTypeName(q.type)} className="dropSet">
        <p onClick={() => setType("single")}>객관식(단일)</p>
        <p onClick={() => setType("multiple")}>객관식(중복)</p>
        <p onClick={() => setType("text")}>주관식</p>
        <p onClick={() => setType("image")}>이미지</p>
      </Dropdown>
        <button
          type="button"
          style={{ background: "#E9623A", color: "#fff", padding: "4px 12px", borderRadius:"4px" }}
          onClick={() => dispatch({ type: "REMOVE_QUESTION", qid: q.qid })}
        >
          삭제
        </button>
      </div>

      {/* 타입 변경 UI (임시 버튼들) */}

      {/* 공통 필드 */}
      <div style={{ display: "grid", gap: 8 }} >
        <p>{}</p>
        <input
          placeholder="제목을 입력하세요."
          value={q.title}
          onChange={(e) =>
            dispatch({ type: "SET_TITLE", qid: q.qid, value: e.target.value })
          }
        />
        <textarea
          placeholder="질문 설명"
          value={q.explain}
          onChange={(e) =>
            dispatch({ type: "SET_EXPLAIN", qid: q.qid, value: e.target.value })
          }
        />
      </div>
      {/* 이미지일 때만 옵션 */}
      {(q.type === "image") && (<>
        <div>
            <FilePreview></FilePreview>
        </div>
      </>)}
      {/* 객관식일 때만 옵션 */}
      {(q.type === "single" || q.type === "multiple") && (
        <div className="multipleSet">
          <div style={{ marginBottom: 8, fontWeight: 600 }}>옵션</div>
          {q.options.map((opt) => {
            const inputId = `q-${q.qid}-opt-${opt.id}`;
            const isRadio = q.type === "single";
            return (
              <div key={opt.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                {/* 미리보기(선택 UI) */}
                <input
                  id={inputId}
                  type={isRadio ? "radio" : "checkbox"}
                  name={`preview-${q.qid}`}
                  disabled
                />

                {/* 라벨 텍스트 편집칸 */}
                <input
                  type="text"
                  placeholder="옵션 라벨"
                  value={opt.label}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_OPTION",
                      qid: q.qid,
                      id: opt.id,
                      label: e.target.value,
                    })
                  }
                  style={{ flex: 1 }}
                />

                {/* label과 연결 (원하면 아이콘/텍스트 넣기) */}
                <label htmlFor={inputId} />

                <button
                  type="button"
                  onClick={() =>
                    dispatch({ type: "REMOVE_OPTION", qid: q.qid, id: opt.id })
                  }
                >
                  <DeleteBtn></DeleteBtn>
                </button>
              </div>
            );
          })}

          <button
            type="button"
            className="basicBtn"
            onClick={() => dispatch({ type: "ADD_OPTION", qid: q.qid })}
          >
            항목추가
          </button>
        </div>
      )}
    </div> 
  );
});