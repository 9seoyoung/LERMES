//  등록된 일정 확인

import React, { useState } from "react";
import {GrayBtn} from './UiComp.jsx';
import styles from '../../styles/SchedList.module.css';

function SchedList() {
  const [schedules, setSchedules] = useState([
    "일정 1",
    "일정 2",
    "일정 3",
    "일정 4",
    "일정 5",
    "일정 6",
  ]);
  const [input, setInput] = useState("");

  const addSchedule = () => {
    if (input.trim() !== "") {
      setSchedules([...schedules, input]);
      setInput("");
    }
  };

  return (
    <div className={styles.sched}>
      {/* 상단 입력창 + 버튼 */}
      <div className={styles.schedInput}>
        <input
          type="text"
          placeholder="등록된 일정 (xx월 xx일)"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        {/* <button onClick={addSchedule}>+ 일정등록</button> */}
        <GrayBtn onClick={addSchedule} textType="+ 일정등록" />
      </div>

      {/* 일정 목록 */}
      <ul className={styles.schedList}>
        {schedules.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
}

export default SchedList;


