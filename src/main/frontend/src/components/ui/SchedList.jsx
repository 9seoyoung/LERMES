// 일정 목록

import React, { useState, useEffect } from "react";
import { SchedAddBtn } from './UiComp.jsx';
import SchedListPopUp from './SchedListPopUp.jsx';
import styles from '../../styles/SchedList.module.css';
import '../../styles/token.css';
import { useAccount } from "../../auth/AuthContext.jsx";
// import { api } from "../../services/api"; // 실제 axios 인스턴스 사용한다면

function SchedList({ selectedDate, displayDate, setDisplayDate, schedules, setSchedules, events, setEvents }) {
  // const [schedules, setSchedules] = useState({});      // 날짜별 일정 저장
  // const [events, setEvents] = useState({});            // ✅ 문자열 → 객체로
  const [showPopup, setShowPopup] = useState(false);
  const { user } = useAccount();

  // 안전한 패딩 유틸
  const z2 = (n) => String(n).padStart(2, '0');

  useEffect(() => {
    if (!selectedDate) {
      setDisplayDate('선택된 날짜 없음');
      return;
    }

    // selectedDate는 'YYYY-MM-DD'
    const [y, m, d] = selectedDate.split('-').map(Number);

    // 화면용 문구
    setDisplayDate(`${m}월 ${d}일`);

    // 백엔드 조회에 쓸 파라미터(필요하면 사용)
    const params = {
      year: y,
      month: m,
      day: d,
      // 관리자(≤3)만 비공개? 맞다면 그대로 두고, 숫자 보장
      isPrivate: (user?.USER_AUTHRT_SN ?? 9) <= 3 ? 1 : 0,
    };

    // 🔎 실제 호출이 있다면 여기서 진행
    // (예시)
    // api.get("/calendar/todo", { params })
    //   .then(res => setEvents(res.data ?? {}))
    //   .catch(err => console.error("[get todo]", err.response?.data ?? err));

  }, [selectedDate, user, setDisplayDate]); // ✅ 의존성 배열 수정

  // 팝업에서 제목/시작일 받아 일정 추가
  const handleSaveSchedule = ({ title, startDate }) => {
    if (!selectedDate) return;
    if (!title || title.trim() === "") return;

    // selectedDate 그대로 키로 사용 (이미 YYYY-MM-DD)
    const [y, m, d] = selectedDate.split('-').map(Number);
    const dateKey = `${y}-${z2(m)}-${z2(d)}`; // ✅ 월+일을 안정적으로 0패딩

    // 사이드 목록(단순 텍스트 목록)
    setSchedules(prev => {
      const prevList = prev[selectedDate] || [];
      return { ...prev, [selectedDate]: [...prevList, title] };
    });

    // 이벤트(객체) 누적
    setEvents(prev => {
      const prevEvents = prev[dateKey] || [];
      return { ...prev, [dateKey]: [...prevEvents, title] };
    });

    setShowPopup(false);
  };

  // 현재 날짜 일정
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

      {showPopup && (
        <SchedListPopUp
          onClose={() => setShowPopup(false)}
          onSave={handleSaveSchedule}
          selectedDate={selectedDate}
        />
      )}
    </div>
  );
}

export default SchedList;