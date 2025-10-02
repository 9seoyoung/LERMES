import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import FilterList from "../../../components/ui/FilterList";
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { hortlistByCpSn } from "../../../services/cohortService";
import TodayAttendList from "../../../components/layout/inho/TodayAttendList";
import ScheduleList from "../../../components/ui/ScheduleList";
import BigCal from "../../../components/ui/BigCal";

function formatYMD(d) {
  if (!(d instanceof Date)) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function GroupSet() {
  const navigate = useNavigate();
  const { user } = useAccount();
  const {effectiveSn} = useSelectedCompany();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(formatYMD(new Date())); // 문자열로 시작
  const [selectedDay, setSelectedDay] = useState(new Date().getDate()); // 숫자 (일자)
  const [events, setEvents] = useState([]); // { 'YYYY-MM-DD': ['일정1', '일정2'] }
  const [displayDate, setDisplayDate] = useState("");                     // 문자열
  const [selectedIdx, setSelected] = useState(0);

  const coSn = user?.USER_OGDP_CO_SN;

  const [hortlist, setHortList] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filterArr, setFilterArr] = useState([]);

    // 'YYYY-MM-DD'로 파생 (SchedList 전용)
  const selectedDateStr = useMemo(() => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth(); // 0-based
    return formatYMDfrom(y, m, selectedDay);
  }, [currentDate, selectedDay]);

function formatYMDfrom(year, month /* 0-based */, day) {
  if (!Number.isInteger(day)) return "";
  const m = String(month + 1).padStart(2, "0"); // month는 0부터 시작하니까 +1
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

  // 초기화: currentDate는 Date, selectedDate는 'YYYY-MM-DD'
  useEffect(() => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(formatYMD(today)); // ✅ 숫자 아님
  }, []);

  // selectedDate → "MM월 DD일" 표시
  useEffect(() => {
    if (typeof selectedDate === "string" && selectedDate.includes("-")) {
      const [, month, day] = selectedDate.split("-").map(Number);
      if (Number.isInteger(month) && Number.isInteger(day)) {
        setDisplayDate(`${month}월 ${day}일`);
        return;
      }
    }
    setDisplayDate("선택된 날짜 없음");
  }, [selectedDate]);

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

  // BigCal이 Date를 넘겨줄 수도 있는 경우를 대비
  const handleSelectDate = (v) => {
    if (v instanceof Date) return setSelectedDate(formatYMD(v));
    if (typeof v === "string") return setSelectedDate(v);
    // 다른 타입 무시
  };

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
          <BigCal
              selectedDate={selectedDay}          // ✅ BigCal은 숫자(일자) 유지
              setSelectedDate={setSelectedDay}    // ✅ 그대로 숫자 세터 전달
              currentDate={currentDate}           // Date
              setCurrentDate={setCurrentDate}
              events={events}
              setEvents={setEvents}
            />
          </div>
        </div>

        <div className="main_R" style={{ flex: '1', gap: '16px' }}>
          <div className='dashBoardModule' style={{ height: '232px' }}>
            <ScheduleList selectedDate={selectedDateStr} />    
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