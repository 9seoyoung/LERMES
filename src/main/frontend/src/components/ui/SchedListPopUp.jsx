import React, { useState } from "react";
import {SaveBtn} from './UiComp.jsx';
import styles from "../../styles/SchedListPopUp.module.css";

function SchedListPopUp() {
  const [showOptions, setShowOptions] = useState(false);
  const [memo, setMemo] = useState("");
  const today = new Date().toLocaleDateString();

  return (
    <div className={styles.container}>
      {/* 상단 날짜 + 버튼 */}
      <div className={styles.header}>
        <div>{today}</div>
        {/* <button onClick={() => alert("추가 버튼 클릭")}>+</button> */}
        <SaveBtn textType="저장" />
      </div>
      <hr style={{width: "330px", marginTop:"10px" }} />

      {/* 메모 */}
      <div className={styles.memo}>
        <textarea
          rows={4}
          placeholder="메모를 입력하세요"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          style={{ width: "100%" }}
        />
      </div>

      {/* 옵션 토글 */}
      <div
        className={styles.optionsToggle}
        onClick={() => setShowOptions(!showOptions)}
      >
        <span className={`${styles.arrow} ${showOptions ? styles.arrowOpen : ""}`}>
          ▼
        </span>
        더 많은 옵션
      </div>

      {/* 옵션 내용 */}
      {showOptions && (
        <div className={styles.optionsContent}>
            <div>
                <label>시작일</label>
                <input />
            </div>
            <div>
                <label>종료일</label>
                <input />
            </div>
            <div>
                <label>시간</label>
                <input />
            </div>
            <div>
                <label>장소</label>
                <input />
            </div>
        </div>
      )}
    </div>
  );
}

export default SchedListPopUp;


