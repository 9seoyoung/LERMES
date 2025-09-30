import AttendanceSummaryCard from '../components/layout/inho/AttendanceSummaryCard';
import AttendAdjustStudentRequestList from '../components/layout/inho/AttendAdjustStudentRequestList';
import '../styles/Attend.css';
import MyInfoForm from '../components/layout/inho/MyInfoForm';
import UserProfile from '../components/layout/inho/UserProfile';
import '../components/layout/inho/Mypage.css';
import CompanyBigLogoUploader from '../components/layout/inho/CompanyBigLogoUploader';
import CompanyInfoForm from '../components/layout/inho/CompanyInfoForm';

export default function Mypage() {
  return (
    <div>
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section>
          <div style={{ display: 'flex' }}>
            <UserProfile />
            <MyInfoForm />
          </div>
        </section>
      </div>
    </div>
  );
}

export function AdminMypage() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        width: '100%',
      }}
    >
      <h2>내 정보</h2>
      <div className="my-page-div" style={{ minHeight: '646px' }}>
        <section style={{ display: 'flex', flexDirection: 'column' }}>
          <UserProfile />
          <CompanyInfoForm />
        </section>
        <section style={{ width: '100%' }}>
          <CompanyBigLogoUploader />
        </section>
      </div>
    </div>
  );
}

export function StdMypage() {
  return (
    <div>
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section>
          <UserProfile />
          <MyInfoForm />
        </section>
        <section className="std-my-page-second">
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
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section>
          <UserProfile />
          <MyInfoForm />
        </section>
      </div>
    </div>
  );
}
