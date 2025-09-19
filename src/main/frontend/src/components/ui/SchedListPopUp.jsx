// 일정 등록 팝업창

import React, { useState } from "react";
import {SaveBtn, CancelBtn} from './UiComp.jsx';
import styles from "../../styles/SchedListPopUp.module.css";

function getTodayString() {
  const today = new Date();
  return today.toISOString().split('T')[0]; // yyyy-mm-dd 형식
}

function getInitialDate(selectedDate) {
  return selectedDate || new Date().toISOString().split("T")[0];
}

function SchedListPopUp({onClose, onSave, selectedDate}) {
  const [showOptions, setShowOptions] = useState(false);
  const today = new Date().toLocaleDateString();
  const [title, setTitle] = useState(""); // ⬅️ 제목 상태 추가
  const [memo, setMemo] = useState(""); // 메모
  const [startDate, setStartDate] = useState(() => getInitialDate(selectedDate)); // 시작일
  const [endDate, setEndDate] = useState(""); // 종료일
  const [startTime, setStartTime] = useState(""); // 시작 시간
  const [endTime, setEndTime] = useState(""); // 종료 시간
  const [location, setLocation] = useState(""); // 장소

const handleSave = () => {
  // 제목 유효성 검사
  if (typeof title !== 'string' || !title.trim()) {
    alert("제목을 입력해주세요.");
    return;
  }

  // 시작일 유효성 검사
  if (!startDate) {
    alert("시작일을 선택해주세요.");
    return;
  }

  // 저장 (부모 컴포넌트로 제목, 시작일 전달)
  onSave({
    title: title.trim(),
    startDate,
  });
};

  return (
  <div className={styles.overlay}>
    <div
      className={`${styles.container} ${showOptions ? styles.containerExpanded : styles.containerCollapsed}`}>
      {/* 상단 날짜 + 버튼 */}
      <div className={styles.header}>
        <input
          placeholder="제목 입력"
          className={styles.schedTitle}
          value={title}
          onChange={(e) => {
          setTitle(e.target.value);
          console.log("title", e.target.value);
          }}
        />

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
          onChange={(e) => {
          setMemo(e.target.value);
          console.log("memo", e.target.value);
          }}

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
            <input
              type="date"
              value={startDate}
              onChange={(e) => {
              setStartDate(e.target.value);
              console.log("startDate", e.target.value);
              }}
            />
          </div>
          <div className={styles.content}>
                <label>종료일</label>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => {
                    setEndDate(e.target.value);
                    console.log("endDate", e.target.value);
                    }}
                />
          </div>
            <div className={styles.content}>
                <label>시간</label>
                <div className={styles.timeInput}>
                <input
                    type="time"
                     value={startTime}
                     onChange={(e) => {
                     setStartTime(e.target.value);
                     console.log("startTime", e.target.value);
                     }}
                />
                <div>~</div>
                <input
                    type="time"
                     value={endTime}
                     onChange={(e) => {
                     setEndTime(e.target.value);
                     console.log("endTime", e.target.value);
                     }}
                />
                </div>
            </div>
            <div className={styles.content}>
                <label>장소</label>
                <input
                type="text"
                 value={location}
                 onChange={(e) => {
                 setLocation(e.target.value);
                 console.log("location", e.target.value);
                 }}
            />
            </div>
        </div>
      )}
    </div>
  </div>
  );
}

export default SchedListPopUp;