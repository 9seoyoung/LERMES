// QuestionReadType.jsx
import React, { useRef, useImperativeHandle, forwardRef } from "react";
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

const QuestionReadType = forwardRef(function QuestionReadType(
    {
      q, qNum,
      onRemoveQuestion,
      onSetType,
      onSetTitle,
      onSetExplain,
      onAddOption,
      onUpdateOption,
      onRemoveOption,
      setFiles
    },
    ref
) {
  const isChoice = q.type === "single" || q.type === "multiple";
  const isRadio = q.type === "single";
  const rootRef = useRef(null);
  const titleRef = useRef(null);

    useImperativeHandle(ref, () => ({
      getRoot: () => rootRef.current,
      focusTitle: () => titleRef.current?.focus?.({ preventScroll: true }),
  }));
  
 
  return (
      <div ref={rootRef} data-qid={q.qid}>
        <div className="qCont">
          <div className="qTitle">
            <p>{`Q${qNum}.`}</p>
            <input
                ref={titleRef}
                placeholder="제목을 입력하세요."
                value={q.title}
                style={{color: "var(--font-color-base"}}
                onChange={(e) => onSetTitle(q.qid, e.target.value)}
                disabled={true}
            />
          </div>

          <textarea
              className="questionCont"
              placeholder="질문 설명"
              value={q.explain}
              style={{color: "var(--font-color-base"}}
              onChange={(e) => onSetExplain(q.qid, e.target.value)}
          />

          <hr className="hrSt2" />

          {q.type === "image" && (
              <div style={{width: "100%", overflow:"hidden"}}>
                <FilePreview qid ={q.qid} setFiles={setFiles}/>
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
                            style={{color: "var(--font-color-base"}}
                            disabled
                        />

                        <input
                            className={styles.input}
                            type="text"
                            placeholder="항목을 입력하세요."
                            value={opt.label}
                            onChange={(e) => onUpdateOption(q.qid, opt.id, e.target.value)}
                            style={{ flex: 1 , color: "var(--font-color-base"}}
                        />

                        <label htmlFor={inputId} />

                        <DeleteBtn type="button" onClick={() => onRemoveOption(q.qid, opt.id)}/>
                      </div>
                  );
                })}
              </div>
          )}
        </div>
      </div>
  );
});

export default QuestionReadType;
