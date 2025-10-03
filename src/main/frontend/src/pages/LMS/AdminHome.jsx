import CohortAbsenceCard from '../../components/layout/inho/CohortAbsenceCard';
import AttendAdjustAdminPage from '../../components/layout/inho/AttendAdjustAdminPage';
import ScheduleList from '../../components/ui/ScheduleList';
import SchedList from '../../components/ui/SchedList';
import MiniCal from '../../components/ui/MiniCal';
import CalSched from '../../components/ui/CalSched';

export default function AdminHome() {
  
  return (
    <div className="mainCont_Lms_Row" >
      <div className="main_L" style={{ width: '40%', maxHeight: "702px", overflow: "hidden" }}>
          <div className='dashBoardModule' style={{display: "flex", flexDirection: "column", maxHeight: "702px"}}>
            <CalSched></CalSched>
          </div>
      </div>
      <div className="main_R" style={{ flex: '1', gap: '16px', height: "100%", maxHeight: "702px"}}>
        <div className='dashBoardModule' style={{ height: '232px' }}>
          <CohortAbsenceCard />
        </div>
        <div className='dashBoardModule' style={{height: "100%", justifyContent: "space-between" }}>
          <AttendAdjustAdminPage />
        </div>
      </div>
    </div>
  );
}
