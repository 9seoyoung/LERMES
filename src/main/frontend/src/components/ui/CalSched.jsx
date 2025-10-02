// src/components/calendar/CalSched.jsx
import React, { useEffect, useState } from 'react';
import MiniCal from './MiniCal';
import SchedList from './SchedList';
import styles from '../../styles/CalSched.module.css';
import { useAccount } from '../../auth/AuthContext';
import { pullToDoList } from "../../services/calService.js";
import { diffDaysInclusive } from '../../utils/dateformat.js';

const z2 = (n) => String(n).padStart(2, '0');

const CalSched = () => {
  const { user } = useAccount();
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayDate, setDisplayDate] = useState('');
  const [todayList, setTodayList] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [events, setEvents] = useState({});
  const [monthlyTodoRaw, setMonthlyTodoRaw] = useState([]); // ★ 원본 배열


  useEffect(() => {
    if (!selectedDate || !user) {
      setDisplayDate('선택된 날짜 없음');
      return;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateKey = `${year}-${z2(month)}-${z2(day)}`;

    const params = {
      year,
      month,
      day,
      isPrivate: (user.USER_AUTHRT_SN <= 3 ? 1 : 0),
    };

    setDisplayDate(`${month}월 ${day}일`);

    (async () => {
      try {
        // 당일 목록
        const res = await pullToDoList(params); // axios.get('/api/...', { params })
        const list = res?.data ?? [];
        setTodayList(list);

        // 사이드 목록(텍스트)와 events(객체) 갱신
        setSchedules(prev => ({
          ...prev,
          [selectedDate]: list.map(v => v.eventNm)
        }));

        setEvents(prev => ({
          ...prev,
          [dateKey]: list
        }));

        // 월 전체 목록
        const monthlyRes = await pullToDoList({ year, month, isPrivate: 1 });

        const raw = monthlyRes?.data;
        const monthlyList = Array.isArray(raw) ? raw : Object.values(raw ?? {});
        setMonthlyTodoRaw(monthlyList);  // ★ 항상 배열


        // (선택) 전체 기간 일수 필드 부여해두면 다른 곳에서 재사용 편함
        const withPeriod = monthlyList.map(v => ({
          ...v,
          periodDays: diffDaysInclusive(v.eventBgngDt, v.eventEndDt),
        }));

        // 미니캘용 맵
      } catch (err) {
        console.error("[pullToDoList] error:", err?.response?.data ?? err);
      }
    })();

  }, [selectedDate, user]);

  return (
    <>
      <div className={styles.miniCalWrapper}>
        <MiniCal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          monthlyTodoRaw={monthlyTodoRaw}
        />
      </div>

      <div className={styles.schedListWrapper}>
        <SchedList
          setSchedules={setSchedules}
          schedules={schedules}
          events={events}
          setEvents={setEvents}
          selectedDate={selectedDate}
          displayDate={displayDate}
          setDisplayDate={setDisplayDate}
        />
      </div>
    </>
  );
};

export default CalSched;