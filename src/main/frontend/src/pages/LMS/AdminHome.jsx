import CohortAbsenceCard from '../../components/layout/inho/CohortAbsenceCard';
import AttendAdjustAdminPage from '../../components/layout/inho/AttendAdjustAdminPage';
import CalSched from '../../components/ui/CalSched';
import AbsenceRequest from '../../components/module/attendance/AbsenceRequest';

export default function AdminHome() {
  
  return (
    <div className="mainCont_Lms_Row" style={{height: "702px"}}>
      <div className="main_R" style={{ flex: '1', gap: '16px', height: "100%", maxHeight: "702px"}}>
      <AbsenceRequest></AbsenceRequest>
        <div className='dashBoardModule' style={{ height: '232px' }}>
          <CohortAbsenceCard />
        </div>
        <div className='dashBoardModule' style={{height: "100%", justifyContent: "space-between" }}>
          <AttendAdjustAdminPage />
        </div>
      </div>
      <div className="main_L" style={{ width: '40%', maxHeight: "702px", overflow: "hidden" }}>
          <div className='dashBoardModule' style={{display: "flex", flexDirection: "column", maxHeight: "702px", background: "none", boxShadow: "none"}}>
            <CalSched></CalSched>
          </div>
      </div>
    </div>
  );
}
