// src/components/calendar/SchedList.jsx
import React, { useState, useEffect } from "react";
import { SchedAddBtn } from './UiComp.jsx';
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';
import '../../styles/token.css';
import { useAccount } from "../../auth/AuthContext.jsx";
import { useLocation } from "react-router-dom";

function SchedList({
  selectedDate,
  displayDate,
  setDisplayDate,
  schedules,
  setSchedules,
  events,
  setEvents
}) {
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAccount();
  const curloc = useLocation();

  const z2 = (n) => String(n).padStart(2, '0');

  useEffect(() => {
    if (!selectedDate) {
      setDisplayDate('선택된 날짜 없음');
      return;
    }
    const [y, m, d] = selectedDate.split('-').map(Number);
    setDisplayDate(`${m}월 ${d}일`);

    // 필요 시 여기서 selectedDate기준 새로 로딩할 수도 있음
    // const params = {
    //   year: y, month: m, day: d,
    //   isPrivate: (user?.USER_AUTHRT_SN ?? 9) <= 3 ? 1 : 0,
    // };
  }, [selectedDate, user, setDisplayDate]);

  // 팝업에서 저장 클릭 시
  const handleSaveSchedule = ({ title, startDate }) => {
    if (!selectedDate) return;
    if (!title || title.trim() === "") return;

    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateKey = `${y}-${z2(m)}-${z2(d)}`;

    // 사이드 목록(텍스트)
    setSchedules(prev => {
      const prevList = prev[selectedDate] || [];
      return { ...prev, [selectedDate]: [...prevList, title] };
    });

    // 이벤트(객체) 누적 - 여기선 제목 문자열만 넣었지만 실제론 객체 쓰면 좋음
    setEvents(prev => {
      const prevEvents = prev[dateKey] || [];
      return { ...prev, [dateKey]: [...prevEvents, title] };
    });

    setShowPopup(false);
  };

  const currentDateSchedules = schedules[selectedDate] || [];

  return (
    <>
      <h4>
         <div style={{color: "#E9623A", display:"flex", gap:"4px", alignItems:"center"}}>TODO <p style={{fontSize:"1.4rem", fontWeight:"500"}}>({displayDate})</p></div>
         {curloc.pathname === "/adminHome/groupSet" ? null :
         <div className="specificBtn" onClick={() => setShowPopup(true)}>+일정등록</div>}
      </h4>

      <ul className={styles.schedList}>
        {currentDateSchedules.length === 0 ? (
          <li>등록된 일정이 없습니다.</li>
        ) : (
          currentDateSchedules.map((item, index) => <li key={index}>{item}</li>)
        )}
      </ul>

      {showPopup && (
        <SchedListPopUp
          onClose={() => setShowPopup(false)}
          onSave={handleSaveSchedule}
          selectedDate={selectedDate}
        />
      )}
    </>
  );
}

export default SchedList;