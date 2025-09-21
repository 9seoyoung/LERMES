// QuestionType.jsx
import React, { forwardRef } from "react";
import FilePreview from "../../../components/ui/FilePreview";
import { AddBtn, DeleteBtn } from "../../../components/ui/UiComp";
import styles from "../../../styles/UiComp.module.css";
import Dropdown from "../../../components/ui/Dropdown";

function changeTypeName(value) {
  switch (value) {
    case "single": return "객관식(단일)";
    case "multiple": return "객관식(다중)";
    case "text": return "주관식";
    case "image": return "이미지";
    default: return "객관식";
  }
}

const QuestionType = forwardRef(function QuestionType(
    {
      q, qNum,
      onRemoveQuestion,
      onSetType,
      onSetTitle,
      onSetExplain,
      onAddOption,
      onUpdateOption,
      onRemoveOption,
    },
    ref
) {
  const isChoice = q.type === "single" || q.type === "multiple";
  const isRadio = q.type === "single";

  return (
      <div ref={ref} className="questionBox">
        <div className="questionTypeBox">
          <p>질문 유형</p>
          <Dropdown label={changeTypeName(q.type)} className="dropSet">
            <p onClick={() => onSetType(q.qid, "single")}>객관식(단일)</p>
            <p onClick={() => onSetType(q.qid, "multiple")}>객관식(중복)</p>
            <p onClick={() => onSetType(q.qid, "text")}>주관식</p>
            <p onClick={() => onSetType(q.qid, "image")}>이미지</p>
          </Dropdown>

          <button
              type="button"
              style={{ background: "#E9623A", color: "#fff", padding: "4px 12px", borderRadius: "4px" }}
              onClick={() => onRemoveQuestion(q.qid)}
          >
            삭제
          </button>
        </div>

        <div className="qCont">
          <div className="qTitle">
            <p>{`Q${qNum}.`}</p>
            <input
                placeholder="제목을 입력하세요."
                value={q.title}
                onChange={(e) => onSetTitle(q.qid, e.target.value)}
            />
          </div>

          <textarea
              className="questionCont"
              placeholder="질문 설명"
              value={q.explain}
              onChange={(e) => onSetExplain(q.qid, e.target.value)}
          />

          <hr className="hrSt2" />

          {q.type === "image" && (
              <div>
                <FilePreview />
              </div>
          )}

          {isChoice && (
              <div className="multipleSet">
                {q.options.map((opt) => {
                  const inputId = `q-${q.qid}-opt-${opt.id}`;
                  return (
                      <div key={opt.id} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
                        <input
                            id={inputId}
                            type={isRadio ? "radio" : "checkbox"}
                            name={`preview-${q.qid}`}
                            disabled
                        />

                        <input
                            className={styles.input}
                            type="text"
                            placeholder="항목을 입력하세요."
                            value={opt.label}
                            onChange={(e) => onUpdateOption(q.qid, opt.id, e.target.value)}
                            style={{ flex: 1 }}
                        />

                        <label htmlFor={inputId} />

                        <button type="button" onClick={() => onRemoveOption(q.qid, opt.id)}>
                          <DeleteBtn />
                        </button>
                      </div>
                  );
                })}

                <button type="button" className="basicBtn" onClick={() => onAddOption(q.qid)}>
                  <AddBtn textType={"항목 추가"} />
                </button>
              </div>
          )}
        </div>
      </div>
  );
});

export default QuestionType;
