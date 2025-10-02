// src/components/calendar/MiniCal.jsx
import React, { useEffect, useMemo, useState } from "react";
import styles from "../../styles/MiniCal.module.css";
import { buildOverlayBars, buildWeeks } from "../../utils/calendarBars";

const z2 = (n) => String(n).padStart(2, "0");

export default function MiniCal({ selectedDate, setSelectedDate, monthlyTodoRaw }) {
  // monthlyTodoRaw: 백에서 받은 "월 전체 이벤트 원본 배열" [{eventNm, eventBgngDt, eventEndDt, ...}, ...]

  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    const key = `${today.getFullYear()}-${z2(today.getMonth() + 1)}-${z2(today.getDate())}`;
    setSelectedDate?.(key);
  }, [setSelectedDate]);

  const year = currentDate.getFullYear();
  const month0 = currentDate.getMonth();
  const month = month0 + 1;

  // 셀 그리드용 week 행렬
  const weeks = useMemo(() => buildWeeks(year, month), [year, month]);

  // 오버레이 바(좌표/스팬/스택 인덱스) 생성
  const { bars } = useMemo(
    () => buildOverlayBars(Array.isArray(monthlyTodoRaw) ? monthlyTodoRaw : [], year, month),
    [monthlyTodoRaw, year, month]
  );

  const prevMonth = () => {
    setCurrentDate(new Date(year, month0 - 1, 1));
    setSelectedDate?.(null);
  };

  const nextMonth = () => {
    setCurrentDate(new Date(year, month0 + 1, 1));
    setSelectedDate?.(null);
  };

  const onSelectDate = (day) => {
    if (!day) return;
    setSelectedDate?.(`${year}-${z2(month)}-${z2(day)}`);
  };

  return (
    <div className={styles.cal}>
      {/* 헤더 */}
      <div className={styles.monthNav}>
        <button onClick={prevMonth}>◀</button>
        <h3>{year}년 {month}월</h3>
        <button onClick={nextMonth}>▶</button>
      </div>

      {/* 요일 */}
      <div className={styles.weekdayHeader}>
        {["일","월","화","수","목","금","토"].map((d,i)=>(
          <div key={i} className={styles.weekdayCell}>{d}</div>
        ))}
      </div>

      {/* 달력 컨테이너: 아래 2 레이어 겹침 */}
      <div className={styles.calendarFrame}>
        {/* 1) 셀 레이어 */}
        <div className={styles.cellsGrid}>
          {weeks.map((week, r) => (
            <div key={r} className={styles.rowGrid}>
              {week.map((day, c) => {
                const isNull = day === null;
                const key = !isNull ? `${year}-${z2(month)}-${z2(day)}` : null;
                const isSelected = key && key === selectedDate;
                return (
                  <div
                    key={c}
                    className={`${styles.cell} ${isSelected ? styles.selected : ""} ${isNull ? styles.empty : ""}`}
                    onClick={() => onSelectDate(day)}
                  >
                    <div className={styles.dateLabel}>{day || ""}</div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* 2) 바(오버레이) 레이어 */}
        <div className={styles.barsOverlay}>
          {/* bars: {row, colStart, span, title, stackIndex, z, fullDays} */}
          {bars.map((b) => (
            <div
              key={b.id}
              className={styles.bar}
              title={`${b.title} · ${b.fullDays}일`}
              style={{
                gridRow: b.row,              // 몇 번째 주(행)
                gridColumn: `${b.colStart} / span ${b.span}`, // 시작 요일 ~ span
                zIndex: b.z,
                // 같은 칸에서 위아래로 쌓이게 Y 오프셋
                transform: `translateY(calc(${b.stackIndex} * (var(--bar-height) + var(--bar-gap))))`,
              }}
            >
              {b.title}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}