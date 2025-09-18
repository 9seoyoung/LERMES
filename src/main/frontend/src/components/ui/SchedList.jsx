// 일정 목록

import React, { useState, useEffect } from "react";
import {  SchedAddBtn } from './UiComp.jsx';
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';

function SchedList({selectedDate}) {
  const [schedules, setSchedules] = useState(["일정 1", "일정 2", "일정 3"]);
  /* const [selectedDate, setSelectedDate] = useState(""); */
  const [input, setInput] = useState("");
  const [showPopup, setShowPopup] = useState(false); // 💡 팝업 상태 추가
  const [displayDate, setDisplayDate] = useState('');

  useEffect(() => {
    if (selectedDate) {
      // selectedDate는 'YYYY-MM-DD' 문자열
      const [year, month, day] = selectedDate.split('-').map(Number);
      const dateObj = new Date(year, month - 1, day);
      setDisplayDate(`${month}월 ${day}일`);
    } else {
      setDisplayDate('선택된 날짜 없음');
    }
  }, [selectedDate]);

  const addSchedule = () => {
    if (input.trim() !== "" && selectedDate) {
      setSchedules([...schedules, `${displayDate}: ${input}`]);
      setInput("");
    }
  };

  return (
    <div className={styles.sched}>
      <div className={styles.schedDateBox}>
         <div className={styles.schedDate}>등록된 일정 ({displayDate})</div>
        <SchedAddBtn textType="+ 일정등록" onClick={() => setShowPopup(true)} />
      </div>

      <ul className={styles.schedList}>
        {schedules.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {showPopup && <SchedListPopUp onClose={() => setShowPopup(false)}
       title={input}
       selectedDate={selectedDate}
       />}
    </div>
  );
}

export default SchedList;
