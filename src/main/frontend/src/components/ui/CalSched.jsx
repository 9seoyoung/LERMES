import React, { useState } from 'react';
import MiniCal from './MiniCal';
import SchedList from './SchedList';
import styles from '../../styles/CalSched.module.css';

const CalendarContainer = () => {
  const [selectedDate, setSelectedDate] = useState(null); // 공유할 상태

  return (
    <div className={styles.container}>
      <MiniCal selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
      <SchedList selectedDate={selectedDate} />
    </div>
  );
};

export default CalendarContainer;
