import CohortAbsenceCard from '../../components/layout/inho/CohortAbsenceCard';
import AttendAdjustAdminPage from '../../components/layout/inho/AttendAdjustAdminPage';
import CalSched from '../../components/ui/CalSched';
import AbsenceRequest from '../../components/module/attendance/AbsenceRequest';

export default function AdminHome() {
  
  return (
    <div className="mainCont_Lms_Row" style={{height: "702px"}}>
      <section className="gridSection-1col" style={{gridTemplateRows: "auto 3fr 1fr 1fr 5fr", gap: "16px"}} >
      {/* <AbsenceRequest></AbsenceRequest>
        <div className='accentSection' style={{ height: '232px' }}>
          <CohortAbsenceCard />
        </div>
        <div className='accentSection' style={{height: "100%", justifyContent: "space-between" }}>
          <AttendAdjustAdminPage />
        </div> */}
        <div className='accentSection' >d</div>
        <div className='gridSection-1col' style={{gridTemplateRows: "auto 1fr", gridTemplateColumns: "1fr 1fr",  gap:"0 12px" }} >
          <div className='accentCard text-em-strong flex'>처리 대기중인 출석 요청<AbsenceRequest></AbsenceRequest></div>
          <div className='grayCard text-em-strong flex'>처리 대기중인 면담 요청</div>
          <div className='basicCard'>김ㅇㅇ / 김ㅇㅇ / 박ㅇㅇ / 이ㅇㅇ</div>
          <div className='basicCard card-title'>출결 이슈</div>
        </div>
        <div className='accentSection' >d</div>
        <div className='accentSection' >d</div>
        <div className='accentSection gridSection-1col' style={{gridAutoRows: "auto 1fr", gap: "16px 12px", gridTemplateColumns: "auto auto", gridTemplateAreas: `"c a" "a2to1 a2to1"`}} >
          <div className='basicCard flex' style={{gap:"12px", gridArea: "c"}}>
            <div className='flex' style={{flex: "1"}}>모집 예정</div>
            <div className='flex' style={{flex: "1"}}>모집중</div>
            <div className='flex' style={{flex: "1"}}>진행 대기</div>
          </div>
          <div className='card-title flex' style={{gridArea: "a"}} > - 이건 사실 필터임</div>
          <div className='basicCard area2to1 gridSection-1col'>
            <div className='text-em-strong'>진행중인 과정</div>
            <a> 과정명(종료일 디데이) / 강사 / 정원 /출석경고 /만족도(되면 오 이건 과제제출에 설문으로 내면되겠다)</a>
            <a> 과정명(시작일/종료일/시작일 디데이) / 강사 / (지원/최종)/모집정원</a>
            <a> 과정명(종료일 디데이) / 강사 / 정원 /출석경고</a>
          </div>
        </div>
      </section>
      <div className="main_L" style={{ width: '40%', maxHeight: "702px" }}>
          <div className='dashBoardModule' style={{display: "flex", flexDirection: "column", maxHeight: "702px"}}>
            <CalSched></CalSched>
          </div>
      </div>
    </div>
  );
}
