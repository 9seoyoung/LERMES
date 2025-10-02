import React, { useState } from 'react';
import MiniCal from './MiniCal';
import SchedList from './SchedList';
import styles from '../../styles/CalSched.module.css';

const CalSched = () => {
  const [selectedDate, setSelectedDate] = useState(null); // 공유할 상태
  const [displayDate, setDisplayDate] = useState('');
  

  return (
  <>
    <div className={styles.miniCalWrapper}>
      <MiniCal selectedDate={selectedDate} setSelectedDate={setSelectedDate} />
    </div>
    <div className={styles.schedListWrapper}>
      <SchedList selectedDate={selectedDate} displayDate={displayDate} setDisplayDate={setDisplayDate}/>
    </div>
  </>
  );
};

export default CalSched;
