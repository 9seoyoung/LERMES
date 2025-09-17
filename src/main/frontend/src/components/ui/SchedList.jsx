// 일정 목록

import React, { useState } from "react";
import {  SchedAddBtn } from './UiComp.jsx';
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';

function SchedList() {
  const [schedules, setSchedules] = useState(["일정 1", "일정 2", "일정 3"]);
  const [selectedDate, setSelectedDate] = useState("");
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false); // 💡 팝업 상태 추가

  const addSchedule = () => {
    if (input.trim() !== "" && selectedDate) {
      setSchedules([...schedules, `${selectedDate}: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className={styles.sched}>
      <div className={styles.schedDateBox}>
        {/* <input
        placeholder="등록된 일정 (xx월 xx일)"
        className={styles.schedTitle}
         value={input}
         onChange={(e) => setInput(e.target.value)}
         /> */}
         <div className={styles.schedDate}>등록된 일정 (xx월 xx일)</div>
        <SchedAddBtn textType="+ 일정등록" onClick={() => setShowPopup(true)} />
      </div>

      <ul className={styles.schedList}>
        {schedules.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {showPopup && <SchedListPopUp onClose={() => setShowPopup(false)}
       title={input}
       />}
    </div>
  );
}

export default SchedList;
