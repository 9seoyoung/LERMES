import { Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAccount } from "../../auth/AuthContext";
import SuperHeader from "../ui/headerModule/SuperHeader"
import MyInfo from "../ui/MyInfo";
import LmsHeader, { VisitorHeader } from "../ui/headerModule/LmsHeader";
import Nav from "../ui/navModule/Nav";
import StdNav from "../ui/navModule/StdNav";
import AdminNav from "../ui/navModule/AdminNav";
import TutorNav from "../ui/navModule/TutorNav";
import { useState } from "react";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";


// 진짜 레이아웃만 짜놓고, 사용자 정보 받아와서 롤, 기본url 체크 후 세부 컴포넌트에서 디자인 바꿔야 할듯
// 세부 컴포넌트 들 마다 outlet 써야할 듯
export default function Layout() {
  const { selectedCompanySn } = useSelectedCompany();
  const navigate = useNavigate();
  const [navToggle, setNavToggle] = useState(false);
  const { user, signOut, patchUser } = useAccount();
  const curloc = useLocation();
  const navKind = curloc.pathname.split('/', 2)[1] || '';
  const testAuthLv = ["1(관리자)", "2(테넌트)", "3(직원)", "4(강사)", "5(수강생)", "6(신청자)", "7(비활성화)"];
  const [selectedItem, setItem] = useState(0);
  const myCoSn = user?.USER_OGDP_CO_SN;

  const myAuth = user?.USER_AUTHRT_SN;
  const authLvPath = {
    1: "adminHome",
    2: "adminHome",
    3: "adminHome",
    4: "tutorHome",
    5: "stdHome",
    6: "visitorHome",
    7: "superHome"
  }
  const loc = authLvPath[myAuth];

  // const onSaveProfile = async (form) => {
  //   const saved = await saveProfile(form);
  //   setUser(saved);           // 서버 결과로 전역 user 교체
  // };

// 헤더 종류 고르기
  function HeaderStatus({ loc }) {
    let component;

    switch (loc) {
      case "adminHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;
      case "stdHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;
      case "tutorHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;

      case "visitorHome":
        component = <LmsHeader navToggle = {navToggle} setNavToggle = {setNavToggle} />;
        break;

      default:
        component = <SuperHeader  />;
    }

    return component;
  }

  function NavStatus({ loc }) {
    let component;

    switch (loc) {
      case "adminHome":
        component = <AdminNav />;
        break;
      case "stdHome":
        component = <StdNav  />;
        break;
      case "tutorHome":
        component = <TutorNav />;
        break;
      default:
        component = <Nav/>;
    }

    return component;
  }

  return (
    <div className="layout">
      <header>
        {/* 페이지 별 헤더 변경 */}
        { myCoSn === selectedCompanySn ? (
          <HeaderStatus loc={loc} setNavToggle={setNavToggle} navToggle={navToggle} />
        )
        :
          <LmsHeader>
            <VisitorHeader />
          </LmsHeader>
        }
        
        {/* 로그인 / 로그아웃 버튼 체인지 */}
        {user === null ?
        <button className="joinBtn" type="button" onClick={() => navigate('/welcome/login')}>Login →</button>
        :
        <MyInfo label={user.USER_NM} className="joinBtn" trigger="hover">
          <div className= "subMenuList" onClick={() => {navigate(`myPage`);}}>마이페이지</div>
          <div className= "subMenuList" onClick={()=> {signOut(); window.location.href = "/";}} >로그아웃</div>
        </MyInfo>
        }
      </header>
      <div className="layout_content">
        <main className="varPage">
          {/* Nav 팝업은 여기서 처리 */}
          {navToggle === false ? null : (
            myCoSn === selectedCompanySn ? (
              <NavStatus loc={navKind} />
            ) : (
              <Nav />
            )
          )}
          {/* Outlet에서 페이지 바뀌는거 보일 예정 */}
          <Outlet />
        </main>
        <footer>
          {(user?.USER_AUTHRT_SN === 1) ?
          <>
            <h2 onClick={() => {navigate('/'); setNavToggle(false);}} style={{cursor:"pointer"}}>LERMES</h2>
            <div onClick={() => navigate('/adminHome')} style={{cursor:"pointer"}}>관리자 홈</div>
            <div onClick={() => navigate('/tutorHome')} style={{cursor:"pointer"}}>강사 홈</div>
            <div onClick={() => navigate('/stdHome')} style={{cursor:"pointer"}}>수강생 홈</div>
            <div onClick={() => navigate('/visitorHome')} style={{cursor:"pointer"}}>방문자 홈</div>
          </>
          :
          <h2 onClick={() => {navigate('/'); setNavToggle(false);}} style={{cursor:"pointer"}}>LERMES</h2>
          }
          <div className="testBox">
            <div style={{ fontSize: "1.4rem", color: "#444" }}>권한</div>

            {user?.USER_EML_ADDR === "hash@com" &&
              testAuthLv.map((item, idx) => (
                <button
                  key={item ?? idx}                  // ← 고유 key
                  type="button"
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    patchUser({ USER_AUTHRT_SN: idx + 1 });
                    setItem(idx);                    // selectedItem 업데이트하는 setter
                  }}
                  className={`testBtn ${selectedItem === idx ? "testClicked" : ""}`}
                >
                  {item}
                </button>
              ))
            }
          </div>

        </footer>
      </div>
    </div>
  )
}
