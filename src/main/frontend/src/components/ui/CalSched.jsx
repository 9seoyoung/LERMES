import React, { useEffect, useState } from 'react';
import MiniCal from './MiniCal';
import SchedList from './SchedList';
import styles from '../../styles/CalSched.module.css';
import { useAccount } from '../../auth/AuthContext';
import { pullToDoList } from "../../services/calService.js";

const CalSched = () => {
  const {user} = useAccount();
  const [selectedDate, setSelectedDate] = useState(null); // 공유할 상태
  const [displayDate, setDisplayDate] = useState('');
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
