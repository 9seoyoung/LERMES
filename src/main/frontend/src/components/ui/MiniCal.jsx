// 미니 캘린더 + 데일리 일정

import React, { useState, useEffect } from 'react';
import styles from '../../styles/MiniCal.module.css';

const MiniCal = ({selectedDate, setSelectedDate}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  /* const [selectedDate, setSelectedDate] = useState(null); */
  // const [events, setEvents] = useState({}); // { 'YYYY-MM-DD': ['일정1', '일정2'] }

  // 새로고침하면 오늘 날짜 선택 (selectedDate도 문자열 'YYYY-MM-DD' 형태로 초기화)
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    const dateKey = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(
      today.getDate()
    ).padStart(2, '0')}`;

    if (setSelectedDate) {
        setSelectedDate(dateKey);
    }
  }, [setSelectedDate]); //setSelectedDate 의존성 추가

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  const startDay = firstDay.getDay();
  const daysInMonth = [];

  for (let i = 0; i < startDay; i++) {
    daysInMonth.push(null);
  }
  for (let i = 1; i <= lastDay.getDate(); i++) {
    daysInMonth.push(i);
  }

  // 주 단위로 나누고 부족한 칸 null로 채움
  const weeks = [];
  for (let i = 0; i < daysInMonth.length; i += 7) {
    let week = daysInMonth.slice(i, i + 7);
    while (week.length < 7) {
      week.push(null);
    }
    if (week.some((day) => day !== null)) {
      weeks.push(week);
    }
  }

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
    setSelectedDate(null);
  };

  const onSelectDate = (day) => {
    if (day === null) return;
    const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setSelectedDate(dateKey);
  };

  // 캘린더 전체 높이 고정 (원하는 값으로 조절 가능)
  const totalCalendarHeight = 200;
  const weekCount = weeks.length;
  const weekHeight = totalCalendarHeight / weekCount;

  return (
  <div className={styles.calContainer}>
    <div className={styles.cal}>
      {/* 상단 네비게이션 */}
      <div className={styles.month}>
        <button onClick={prevMonth}>◀</button>
        <h3>
          {year}년 {month + 1}월
        </h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* 요일 헤더 */}
      <div className={styles.day}>
        {['일', '월', '화', '수', '목', '금', '토'].map((day, idx) => {
          const color = idx === 0 ? 'red' : idx === 6 ? 'blue' : 'black';
          return (
            <div key={idx} style={{ fontWeight: 'bold', color, padding: 8 }}>
              {day}
            </div>
          );
        })}
      </div>

      {/* 날짜 셀 */}
      {weeks.map((week, weekIdx) => (
        <div
          key={weekIdx}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            textAlign: 'center',
            height: weekHeight,
          }}
        >
          {week.map((day, idx) => {
            const dayOfWeek = idx;

            const dateKey = day
              ? `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              : null;

            const isSelected = day !== null && dateKey === selectedDate;

            let color = 'black';
            if (day !== null) {
              if (dayOfWeek === 0) color = 'red';
              else if (dayOfWeek === 6) color = 'blue';
            } else {
              color = 'transparent';
            }

            return (
              <div
                key={idx}
                onClick={() => onSelectDate(day)}
                className={`${styles.calendarCell} ${isSelected ? styles.selected : styles.unselected}`}
                style={{
                  color: day !== null ? color : 'transparent',
                  cursor: day !== null ? 'pointer' : 'default',
                }}
              >
                {/* 날짜 숫자 */}
                {day || ''}

                {/* 일정 모두 표시 */}
                {/* {dateKey && events[dateKey] && events[dateKey].length > 0 && (
                  <div className={styles.eventCell}>
                    {events[dateKey].map((event, i) => (
                      <div key={i} className={styles.event}>
                        {event}
                      </div>
                    ))}
                  </div>
                )} */}
              </div>
            );
          })}
        </div>
      ))}

    </div>
    </div>
  );
};

export default MiniCal;
