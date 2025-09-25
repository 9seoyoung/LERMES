import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';

import SuperHeader from './SuperHeader';
import uiStyle from '../../../styles/UiComp.module.css';
import { useAccount } from '../../../auth/AuthContext';

// 출결 (헤더는 모달만 열고, 실제 입/퇴실은 모달/서비스가 처리)
import TutorAttendModal from '../../..//attend/TutorAttendModal';
import StdAttendModal from '../../../attend/StdAttendModal';
import CheckoutConfirmModal from '../../../attend/CheckoutConfirmModal';
import {
  getTodayStatus,
  checkout,
  getActiveAttendCode,
} from '../../../attend/attendService';

/** 공통 헤더 */
export default function LmsHeader({ navToggle, setNavToggle }) {
  const {fixedSn} = useSelectedCompany();
  const { user } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navKind = pathname.split('/', 2)[1];

  // 현재 페이지별 헤더 라우팅
  function HeaderStatus({ loc }) {
    switch (loc) {
      case 'adminHome':
        return <AdminHeader />;
      case 'stdHome':
        return <StdHeader />;
      case 'tutorHome':
        return <TutorHeader />;
      case 'visitorHome':
        return <VisitorHeader />;
      default:
        return <SuperHeader />;
    }
  }

  return (
    <>
      <div className="header_L">
        <button
          className="navBtn"
          type="button"
          onClick={() => setNavToggle(!navToggle)}
        >
          {navToggle ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* 회사 로고/이름 영역 */}
        <div
          className="logoBox"
          onClick={() => {
            navigate(`/${navKind}`);
            console.log(user);
          }}
        >
          {((user?.USER_AUTHRT_SN === 1 || user?.USER_AUTHRT_SN === 2) && (fixedSn == user?.USER_OGDP_CO_SN)) && (
            <button className="tempBtn basicBtn">로고 변경</button>
          )}
          <h2>{user?.CO_NM || user?.CO_SN}</h2>
        </div>
      </div>

      <HeaderStatus loc={navKind} />
    </>
  );
}

/** 수강생 헤더: 단일 버튼(출석/퇴실) + 상태 표시 */
export function StdHeader() {
  const [showAttendModal, setShowAttendModal] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [inTime, setInTime] = useState(null);
  const [outTime, setOutTime] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAccount();

  console.log(user?.USER_EML_ADDR); // null 대비

  // 오늘 상태 갱신
  const refreshStatus = useCallback(async () => {
    // 로그인 정보 없으면 API 호출하지 않음
    if (!user) {
      setInTime(null);
      setOutTime(null);
      setLoading(false);
      return;
    }
    // (선택) 특정 계정 제외 로직이 필요하면 아래처럼
    if (user?.USER_EML_ADDR === 'hash@com') {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const r = await getTodayStatus(); // { ok, checkinTime, checkoutTime }
      if (r?.ok) {
        setInTime(r.checkinTime ?? null);
        setOutTime(r.checkoutTime ?? null);
      } else {
        setInTime(null);
        setOutTime(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshStatus();
  }, [refreshStatus]);

  const isCheckedIn = !!inTime;
  const isCheckedOut = !!outTime;
  const actionLabel = !isCheckedIn ? '출석' : !isCheckedOut ? '퇴실' : '출석'; // 퇴실 완료면 '출석'(비활성)
  const buttonDisabled = loading || isCheckedOut || !user; // 로그인/세션 확인 전에도 안전

  // 헤더 단일 버튼 클릭 분기
  const onClickAction = () => {
    if (!isCheckedIn) setShowAttendModal(true); // 출석(코드입력)
    else if (!isCheckedOut) setShowConfirm(true); // 퇴실 확인
  };

  const fmt = (t) => (t ? t : '00:00');
  const nowStr = new Date().toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });

  // 퇴실 확정
  const doCheckout = async () => {
    try {
      const r = await checkout(); // ok 래퍼 기준: { ok, message, checkoutTime }
      if (r?.ok) {
        await refreshStatus();
      } else {
        alert(r?.message || '퇴실 실패');
      }
    } finally {
      setShowConfirm(false);
    }
  };

  return (
    <div className="header_R">
      <div className={uiStyle.statusBtn}>
        <div>입실</div>
        <div>{loading ? '- : -' : fmt(inTime)}</div>
      </div>
      <div className={uiStyle.statusBtn}>
        <div>퇴실</div>
        <div>{loading ? '- : -' : fmt(outTime)}</div>
      </div>

      {/* 단일 버튼: 출석 ↔ 퇴실 ↔ 출석(비활성) */}
      <button
        type="button"
        onClick={onClickAction}
        className={uiStyle.checkInBtn}
        disabled={buttonDisabled}
        style={{
          background: buttonDisabled ? '#9ca3af' : undefined,
          opacity: buttonDisabled ? 0.7 : 1,
        }}
      >
        {actionLabel}
      </button>

      {/* 출석 모달(입실) */}
      {showAttendModal && (
        <StdAttendModal
          onClose={async () => {
            setShowAttendModal(false);
            await refreshStatus();
          }}
        />
      )}

      {/* 퇴실 확인 모달(헤더에서 직접 띄움) */}
      {showConfirm && (
        <CheckoutConfirmModal
          nowStr={nowStr}
          onCancel={() => setShowConfirm(false)}
          onConfirm={doCheckout}
        />
      )}
    </div>
  );
}

/** 강사 헤더 */
export function TutorHeader() {
  const [modalOpen, setModalOpen] = useState(false);
  const [activeCode, setActiveCode] = useState(null);

  const refreshCode = async () => {
    try {
      const r = await getActiveAttendCode(); // { data: { code: "65" } }
      setActiveCode(r?.data?.code ?? null);
    } catch {
      setActiveCode(null);
    }
  };

  useEffect(() => {
    refreshCode();
  }, []);

  return (
    <div className="header_R">
      <button
        style={{ padding: '10px 14px' }}
        type="button"
        onClick={() => setModalOpen(true)}
        className={uiStyle.checkInBtn}
      >
        출석 코드 생성
      </button>

      {/* 최신 코드 표시 */}
      {/* {activeCode && (
        <span
          style={{
            width: 120,
            display: 'flex',
            justifyContent: 'center',
            border: 'none',
            marginLeft: 12,
            fontWeight: 700,
            fontSize: 18,
          }}
        >
          현재 코드: {activeCode}
        </span>
      )} */}

      {modalOpen && (
        <TutorAttendModal
          onClose={() => {
            setModalOpen(false);
            refreshCode(); // ✅ 모달 닫힐 때 최신 코드 다시 불러오기
          }}
        />
      )}
    </div>
  );
}

export function AdminHeader() {
  const { user } = useAccount();
  return <></>;
}

export function VisitorHeader() {
  const { user } = useAccount();
  return <></>;
}
