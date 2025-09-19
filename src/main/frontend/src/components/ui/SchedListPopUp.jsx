// 일정 등록 팝업창

import React, { useState } from "react";
import {SaveBtn, CancelBtn} from './UiComp.jsx';
import styles from "../../styles/SchedListPopUp.module.css";

function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // yyyy-mm-dd 형식
}

function SchedListPopUp({onClose, onSave, selectedDate}) {
  const [showOptions, setShowOptions] = useState(false);
  const [memo, setMemo] = useState("");
  const today = new Date().toLocaleDateString();
  const [title, setTitle] = useState(""); // ⬅️ 제목 상태 추가

  // selectedDate가 없으면 오늘 날짜 사용
   const getInitialDate = () => {
     return selectedDate || new Date().toISOString().split('T')[0];
   };

  const [startDate, setStartDate] = useState(getInitialDate());

    const handleSave = () => {
      onSave(title);  // ⬅️ 제목을 부모 컴포넌트에 전달
    };

  return (
  <div className={styles.overlay}>
    <div
      className={`${styles.container} ${showOptions ? styles.containerExpanded : styles.containerCollapsed}`}>
      {/* 상단 날짜 + 버튼 */}
      <div className={styles.header}>
        <input placeholder="제목 입력" className={styles.schedTitle} value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className={styles.popUpBtn}>
            <SaveBtn onClick={handleSave} textType="저장" />
           <CancelBtn onClick={onClose} textType="취소" />
        </div>
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
        상세보기
      </div>

      {/* 옵션 내용 */}
      {showOptions && (
        <div className={styles.optionsContent}>
            <div className={styles.content}>
                <label>시작일</label>
                <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
            </div>
            <div className={styles.content}>
                <label>종료일</label>
                <input type="date" />
            </div>
            <div className={styles.content}>
                <label>시간</label>
                <div className={styles.timeInput}>
                <input type="time" />
                <div>~</div>
                <input type="time" />
                </div>
            </div>
            <div className={styles.content}>
                <label>장소</label>
                <input type="text" />
            </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default SchedListPopUp;