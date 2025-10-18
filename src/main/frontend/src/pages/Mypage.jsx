import AttendanceSummaryCard from '../components/layout/inho/AttendanceSummaryCard';
import AttendAdjustStudentRequestList from '../components/layout/inho/AttendAdjustStudentRequestList';
import '../styles/Attend.css';
import MyInfoForm from '../components/layout/inho/MyInfoForm';
import UserProfile from '../components/layout/inho/UserProfile';
import '../components/layout/inho/Mypage.css';
import CompanyBigLogoUploader from '../components/layout/inho/CompanyBigLogoUploader';
import CompanyInfoForm from '../components/layout/inho/CompanyInfoForm';
import {useEffect, useRef, useState} from 'react';
import PasswordChangeModal from '../components/layout/inho/PasswordChangeModal';
import {useLocation} from "react-router-dom";

export default function Mypage() {
  const [infoEditToggle, setInfoEditToggle] = useState(false);
  const {pathname} = useLocation();



  return (
    <div >
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section
          style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        >
             <UserProfile infoEditToggle={infoEditToggle} setInfoEditToggle={setInfoEditToggle}/>


        </section>
      </div>
    </div>
  );
}

export function AdminMypage() {
  const [open, setOpen] = useState(false);
  const companyRef = useRef(null);

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
          {/* ✅ ref 전달용 onAdminSave props 추가 */}
          <UserProfile
            onAdminSave={() => companyRef.current?.saveCompanyInfo()}
          />

          <div style={{ textAlign: 'right', margin: '8px 0', width: '100%' }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                background: '#eee',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              비밀번호 변경
            </button>
          </div>

          {open && <PasswordChangeModal onClose={() => setOpen(false)} />}

          {/* ✅ ref 연결 */}
          <CompanyInfoForm ref={companyRef} />
        </section>

        <section style={{ width: '100%' }}>
          <CompanyBigLogoUploader />
        </section>
      </div>
    </div>
  );
}

export function StdMypage() {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section>
          <UserProfile />
          {/* 비번바꾸기 모달 */}
          <div style={{ textAlign: 'right', margin: '8px 0', width: '100%' }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                background: '#eee',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              비밀번호 변경
            </button>
          </div>
          {open && <PasswordChangeModal onClose={() => setOpen(false)} />}
          {/* 비번 바꾸기 모달 */}
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
  const [open, setOpen] = useState(false);
  return (
    <div>
      <header className="my-page-header">내 정보</header>
      <div className="my-page-div">
        <section>
          <UserProfile />
          {/* 비번바꾸기 모달 */}
          <div style={{ textAlign: 'right', margin: '8px 0', width: '100%' }}>
            <button
              onClick={() => setOpen(true)}
              style={{
                background: '#eee',
                width: '100%',
                border: '1px solid #ccc',
                borderRadius: '4px',
                padding: '6px 12px',
                fontSize: '13px',
                cursor: 'pointer',
                display: 'flex',
                justifyContent: 'end',
              }}
            >
              비밀번호 변경
            </button>
          </div>
          {open && <PasswordChangeModal onClose={() => setOpen(false)} />}
          {/* 비번 바꾸기 모달 */}
          <MyInfoForm />
        </section>
      </div>
    </div>
  );
}
