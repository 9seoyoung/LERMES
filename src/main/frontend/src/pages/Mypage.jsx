import AttendanceSummaryCard from '../components/layout/inho/AttendanceSummaryCard';
import AttendAdjustStudentRequestList from '../components/layout/inho/AttendAdjustStudentRequestList';
import '../styles/Attend.css';
import MyInfoForm from '../components/layout/inho/MyInfoForm';
import UserProfile from '../components/layout/inho/UserProfile';
import '../components/layout/inho/Mypage.css';
import CompanyBigLogoUploader from '../components/layout/inho/CompanyBigLogoUploader';

export default function Mypage() {
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

export function AdminMypage() {
  return (
    <div>
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section>
          <UserProfile />
          <MyInfoForm />
        </section>
        <section className="admin-my-page-second">
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
