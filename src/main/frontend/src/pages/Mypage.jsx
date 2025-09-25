import AttendanceSummaryCard from '../components/layout/inho/AttendanceSummaryCard';
import AttendAdjustStudentRequestList from '../components/layout/inho/AttendAdjustStudentRequestList';
import AttendAdjustAdminPage from '../components/layout/inho/AttendAdjustAdminPage';
import '../styles/Attend.css';
import MyInfoForm from '../components/layout/inho/MyInfoForm';

export default function Mypage() {
  return (
    <div>
      <div>Mypage</div>
      <AttendanceSummaryCard />
    </div>
  );
}



export function AdminMypage() {
  return (
    <div>
      <div>Mypage</div>
      <AttendAdjustAdminPage />
    </div>
  );
}

export function StdMypage() {
  return (
    <div>
      <div className="std-page-div">
        <section>
          <MyInfoForm />
        </section>
        <section>
          <AttendanceSummaryCard />
          <AttendAdjustStudentRequestList />
        </section>
      </div>
    </div>
  );
}

export function TutorMypage() {
  return (
    <div>
      <div>TutorMypage</div>
    </div>
  );
}
