import { DoorClosedLocked, DoorOpen, DoorOpenIcon, LogIn, LogInIcon, LogOut, LucideLogIn, Plus } from "lucide-react";
import { useEffect, useState } from "react"
import LmsHeader from "../../ui/headerModule/LmsHeader";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { useAccount } from "../../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import { StdHeader } from "./LmsHeader";
import CompanySmallLogoUploader from "../inho/CompanySmallLogoUploader ";
import MyInfo from "../../ui/MyInfo";


// LMS 전용 레이아웃임

function GridLayout() {
  const { effectiveSn, clearFixedSn, fixedSn } = useSelectedCompany();
  const [openToggle, setOpenToggle] = useState(true);
  const navigate = useNavigate();
  const { user, signOut, patchUser, setUser } = useAccount();

  return (
      <div className={`layoutFrame ${openToggle ? "isClosed" : ""}`}>
        <header className="header">
          <div className="logoBox" onClick={() => navigate('/lmsHomeIndex')}>
            <CompanySmallLogoUploader />
          </div>
          <StdHeader></StdHeader>
          {/* 로그인 / 로그아웃 버튼 체인지 */}
        {user === null ?
        <button className="joinBtn" type="button" onClick={() => navigate('/welcome/login')}>Login →</button>
        :
          <MyInfo label={user?.USER_NM} className="joinBtn" trigger="hover">
            <div
              className="subMenuList"
              onClick={() => {
                if (user?.USER_AUTHRT_SN === 2 || user?.USER_AUTHRT_SN === 3) {
                  navigate('/adminHome/myPage');
                } else if (user?.USER_AUTHRT_SN === 5) {
                  navigate('/stdHome/myPage');
                } else if (user?.USER_AUTHRT_SN === 4) {
                  navigate('/tutorHome/myPage');
                } else {
                  navigate('/myPage');
                }
              }}
            >
              마이페이지
            </div>
            <div
              className="subMenuList"
              onClick={() => {
                signOut();
                window.location.href = '/';
              }}
            >
              로그아웃
            </div>
          </MyInfo>
        }
        </header>
        <aside className={`aside ${openToggle ? "isClosed" : ""}`} onClick={() => setOpenToggle(!openToggle)} >
        </aside>
        <main className="main">본문영역임</main>
      </div>
  )
}

export default GridLayout