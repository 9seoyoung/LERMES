import React, { useEffect, useState } from 'react';
import MiniCal from './MiniCal';
import SchedList from './SchedList';
import styles from '../../styles/CalSched.module.css';
import { useAccount } from '../../auth/AuthContext';
import { pullToDoList } from "../../services/calService.js";

const CalSched = () => {
  const { user } = useAccount();
  const [selectedDate, setSelectedDate] = useState(null);
  const [displayDate, setDisplayDate] = useState('');
  const [todayList, setTodayList] = useState([]);
  const [schedules, setSchedules] = useState({});
  const [events, setEvents] = useState({});
  const [monthlyTodo, setMonthlyTodo] = useState({
    // 동적키 [date]: 배열[ 일정1, 일정2, 일정3]
    // 
  });

  const z2 = (n) => String(n).padStart(2, '0');

  useEffect(() => {
    if (!selectedDate || !user) {
      setDisplayDate('선택된 날짜 없음');
      return;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const dateKey = `${year}-${z2(month)}-${z2(day)}`;

    // ✅ Byte로 받으니 0/1 숫자로 보냄 (불린 금지)
    const params = {
      year,
      month,
      day,
      isPrivate: (user.USER_AUTHRT_SN <= 3 ? 1 : 0),
    };

    setDisplayDate(`${month}월 ${day}일`);

    (async () => {
      try {
        console.log("[pullToDoList] params:", params);
        const res = await pullToDoList(params); // axios.get('/api/...', { params })
        const list = res?.data ?? [];
        setTodayList(list);
        
        const monthlyRes = await pullToDoList({year, month, isPrivate: 1});
        console.log(monthlyRes.data);
        setMonthlyTodo(monthlyRes.data ?? []);

        // 사이드 목록(텍스트)와 events(객체) 갱신
        setSchedules(prev => ({
          ...prev,
          [selectedDate]: list.map(v => v.eventNm) // 서버 응답 키에 맞게
        }));

        setEvents(prev => ({
          ...prev,
          [dateKey]: list   // 날짜별로 전체 이벤트 객체 배열 저장
        }));
      } catch (err) {
        console.error("[pullToDoList] error:", err.response?.data ?? err);
      }
    })();

  }, [selectedDate, user]); // ✅ user 의존성 추가

  return (
    <>
      <div className={styles.miniCalWrapper}>
        <MiniCal selectedDate={selectedDate} setSelectedDate={setSelectedDate} events={events} setEvents={setEvents} />
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