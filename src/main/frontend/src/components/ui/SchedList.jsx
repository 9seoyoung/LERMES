// 일정 목록

import React, { useState, useEffect } from "react";
import { SchedAddBtn } from './UiComp.jsx';
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';
import '../../styles/token.css';
import { pullToDoList } from "../../services/calService.js";
import { useAccount } from "../../auth/AuthContext.jsx";

function SchedList({selectedDate, displayDate, setDisplayDate}) {
  const [schedules, setSchedules] = useState({});   // 날짜별 일정 저장
  const [showPopup, setShowPopup] = useState(false); // 💡 팝업 상태 추가
  const [events, setEvents] = useState('');
  const {user} = useAccount();

  useEffect(() => {
    if (selectedDate) {
      // selectedDate는 'YYYY-MM-DD' 문자열
      const [year , month, day] = selectedDate.split('-').map(Number);
      const params = {
        year: year,
        month: month,
        day: day,
        isPrivate : (user.USER_AUTHRT_SN <= 3 ? true : false)
      };

      setDisplayDate(`${month}월 ${day}일`);
      (async () => {
        try {
          console.log(params);
          const res = await pullToDoList(params);
          console.log(res);
        } catch(err) {
          console.log(err.message);
        }

      })();
    } else {
      setDisplayDate('선택된 날짜 없음');
    }
  }, [,selectedDate]);

    // 팝업창에서 제목, 시작일 받아서 일정 추가
    const handleSaveSchedule = ({ title, startDate }) => {
      const [year , month, day] = selectedDate.split('-').map(Number);

      if (title.trim() !== "" && selectedDate) {
        setSchedules(prev => {
          const prevList = prev[selectedDate] || [];
          return {
            ...prev,
            [selectedDate]: [...prevList, title]
          };
        });
        const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(
          selectedDate
        ).padStart(2, '0')}`;
        setEvents((prev) => {
          const prevEvents = prev[dateKey] || [];
          return {
            ...prev,
            [dateKey]: [...prevEvents, title],
          };
        });
      }
      setShowPopup(false);
    };

      // 현재 날짜의 일정만 가져오기
      const currentDateSchedules = schedules[selectedDate] || [];

  return (
    <div className={styles.sched}>
      <div className={styles.schedDateBox}>
         <div className={styles.schedDate}>등록된 일정 ({displayDate})</div>
        <SchedAddBtn textType="+ 일정등록" onClick={() => setShowPopup(true)} />
      </div>

      <ul className={styles.schedList}>
      {currentDateSchedules.length === 0 ? (
      <li>등록된 일정이 없습니다.</li>
      ) : (
      currentDateSchedules.map((item, index) => <li key={index}>{item}</li>)
      )}
      </ul>

      {showPopup && <SchedListPopUp onClose={() => setShowPopup(false)}
       /* title={input} */
       onSave={handleSaveSchedule}
       selectedDate={selectedDate}
       />}
    </div>
  );
}

export default SchedList;