import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FilterList from "../../../components/ui/FilterList";
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { hortlistByCpSn } from "../../../services/cohortService";
import TodayAttendList from "../../../components/layout/inho/TodayAttendList";
import ScheduleList from "../../../components/ui/ScheduleList";
import styles from '../../../styles/CalSched.module.css';
import MiniCal from "../../../components/ui/MiniCal";
import { pullToDoList } from "../../../services/calService";
import { diffDaysInclusive } from "../../../utils/dateformat";


const z2 = (n) => String(n).padStart(2, '0');


function GroupSet() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const {effectiveSn} = useSelectedCompany();
    const [selectedDate, setSelectedDate] = useState(null);
    const [todayList, setTodayList] = useState([]);
    const [schedules, setSchedules] = useState({});
    const [monthlyTodoRaw, setMonthlyTodoRaw] = useState([]); // ★ 원본 배열

  const [events, setEvents] = useState([]); // { 'YYYY-MM-DD': ['일정1', '일정2'] }
  const [displayDate, setDisplayDate] = useState("");                     // 문자열
  const [selectedIdx, setSelected] = useState(0);

  const coSn = user?.USER_OGDP_CO_SN;

  const [hortlist, setHortList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterArr, setFilterArr] = useState([]);


  // 과정 리스트
  useEffect(() => {
    if (!coSn) return;
    let ignore = false;

    (async () => {
      try {
        console.log(`${coSn}-회사SN으로 과정리스트 불러오기API 실행 >>>>>>>>>>>>>>>>>>`)
        setLoading(true);
        const res = await hortlistByCpSn(Number(coSn));
        console.log(res);
        console.log(`${res.data}-회사SN으로 과정리스트 불러오기API 응답 <<<<<<<<<<<<<<<<<<<`)
        // if (!ignore) setHortList(res?.data ?? []);
        if (!ignore) {
          setHortList(res?.data.cohorts );
        }
        console.log(`${hortlist}-회사SN으로 상태에 저장한 리스트`)
      } catch (e) {
        console.error("[GroupSet] hortlistByCpSn error:", e);
      } finally {
        if (!ignore) setLoading(false);
      }
    })();

    return () => { ignore = true; };
  }, [coSn]);

  // 필터 배열
  useEffect(() => {
    const names = (hortlist || []).map(h => h?.cohortNm).filter(Boolean);
    setFilterArr(names);
  }, [hortlist]);

  if (!user) return <div>로딩 중…</div>;


  return (
    <div className="boardPage">
      <h2>과정 관리</h2>

      <div className="filterList">
        <FilterList arr={filterArr} selectedIdx={selectedIdx} setSelected={setSelected} loading={loading}>
          <li className="opacityBtn" onClick={() => { navigate('createGroup'); }}>+</li>
        </FilterList>
        <div className="ftList_R" />
      </div>

      <div className="mainCont_Lms_Row">
        <div className="main_L" style={{ width: '40%' }}>
          <div className='dashBoardModule' style={{ flex: 1 }}>
      <div className={styles.miniCalWrapper}>
        <MiniCal
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
          monthlyTodoRaw={monthlyTodoRaw}
        />
      </div>
          </div>
        </div>

        <div className="main_R" style={{ flex: '1', gap: '16px' }}>
          <div className='dashBoardModule' style={{ height: '232px' }}>
            <ScheduleList          
            setSchedules={setSchedules}
            schedules={schedules}
            events={events}
            setEvents={setEvents}
            selectedDate={selectedDate}
            displayDate={displayDate}
            setDisplayDate={setDisplayDate}/>    
          </div>
          <div className='dashBoardModule' style={{ height: '470px', overflow:"hidden" }}>
            <TodayAttendList />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GroupSet;