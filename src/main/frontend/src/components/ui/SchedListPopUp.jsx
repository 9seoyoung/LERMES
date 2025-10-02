// 일정 등록 팝업창

import React, { useState, useMemo } from "react";
import { SaveBtn, CancelBtn, DateTimeInput } from "./UiComp.jsx";
import styles from "../../styles/SchedListPopUp.module.css";
import { registToDo } from "../../services/calService.js";

function getInitialDate(selectedDate) {
  // yyyy-mm-dd
  return (selectedDate && String(selectedDate).slice(0, 10)) || new Date().toISOString().split("T")[0];
}

function SchedListPopUp({ onClose, onSave, selectedDate }) {
  const initialDate = useMemo(() => getInitialDate(selectedDate), [selectedDate]);

  const [showOptions, setShowOptions] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    memo: "",
    startDate: initialDate,
    endDate: "",
    startTime: "",
    endTime: "",
    location: "",
    isPrivate: true,
  });

  // 공통 변경 핸들러 (input/textarea 모두 지원)
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    // 기본 검증
    if (typeof formData.title !== "string" || !formData.title.trim()) {
      alert("제목을 입력해줘.");
      return;
    }
    if (!formData.startDate) {
      alert("시작일을 선택해줘.");
      return;
    }
    if (formData.endDate && formData.endDate < formData.startDate) {
      alert("종료일은 시작일 이후여야 해.");
      return;
    }
    if (formData.startTime && formData.endTime && formData.endTime <= formData.startTime) {
      alert("종료 시간은 시작 시간 이후여야 해.");
      return;
    }

    // 서버 저장
    try {
      console.log(formData);
      const res = await registToDo(formData); // ← formData 전달
      // 부모에게 알려주기 (응답 데이터 우선, 없으면 formData)
      onSave?.(res?.data ?? formData);
    } catch (err) {
      console.error("[SchedListPopUp] registToDo error:", err);
      alert("저장 중 오류가 발생했어.");
      return;
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={`${styles.container} ${showOptions ? styles.containerExpanded : styles.containerCollapsed}`}>
        {/* 상단 */}
        <div className={styles.header}>
          <input
            placeholder="제목 입력"
            className={styles.schedTitle}
            name="title"
            value={formData.title}
            onChange={handleChange}
          />
          <div className={styles.popUpBtn}>
            <SaveBtn onClick={handleSave} textType="저장" />
            <CancelBtn onClick={onClose} textType="취소" />
          </div>
        </div>

        <hr style={{ width: "330px", marginTop: "10px" }} />

        {/* 메모 */}
        <div className={styles.memo}>
          <textarea
            rows={4}
            placeholder="메모를 입력하세요"
            name="memo"
            value={formData.memo}
            onChange={handleChange}
            style={{ width: "100%" }}
          />
        </div>

        {/* 옵션 토글 */}
        <div className={styles.optionsToggle} onClick={() => setShowOptions((s) => !s)}>
          <span className={`${styles.arrow} ${showOptions ? styles.arrowOpen : ""}`}>▼</span>
          상세보기
        </div>

        {/* 옵션 내용 */}
        {showOptions && (
          <div className={styles.optionsContent}>
            <div className={styles.content}>
              <label>시작일</label>
              <DateTimeInput type="date" name="startDate" value={formData.startDate} onChange={handleChange} />
            </div>

            <div className={styles.content}>
              <label>종료일</label>
              <DateTimeInput type="date" name="endDate" value={formData.endDate} onChange={handleChange} />
            </div>

            <div className={styles.content}>
              <label>시간</label>
              <div className={styles.timeInput}>
                <DateTimeInput type="time" name="startTime" value={formData.startTime} onChange={handleChange} />
                <div>~</div>
                <DateTimeInput type="time" name="endTime" value={formData.endTime} onChange={handleChange} />
              </div>
            </div>

            <div className={styles.content}>
              <label>장소</label>
              <input type="text" name="location" value={formData.location} onChange={handleChange} />
            </div>

            <div className={styles.content}>
              <label>
                <input
                  type="checkbox"
                  name="isPrivate"
                  checked={!!formData.isPrivate}
                  onChange={handleChange}
                  style={{ marginRight: 6 }}
                />
                비공개
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default SchedListPopUp;