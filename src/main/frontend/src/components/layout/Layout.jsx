// 라이브러리
import { Outlet, useLocation } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useAccount } from "../../auth/AuthContext";

// 로직

// 스타일
import layoutStyles from "../../styles/layout.module.css"

// 페이지
import SuperHeader from "../ui/headerModule/SuperHeader"
import MyInfo from "../ui/MyInfo";
import LmsHeader from "../ui/headerModule/LmsHeader";
import Nav from "../ui/navModule/Nav";
import { useEffect, useState } from "react";

// 진짜 레이아웃만 짜놓고, 사용자 정보 받아와서 롤, 기본url 체크 후 세부 컴포넌트에서 디자인 바꿔야 할듯
// 세부 컴포넌트 들 마다 outlet 써야할 듯
export default function Layout() {
  const navigate = useNavigate();
  const [navToggle, setNavToggle] = useState(false);
  const { user, signOut } = useAccount();
  const curloc = useLocation();
  const navKind = curloc.pathname.split('/', 2)[1];

  useEffect(() => {

  const Toggle = (navToggle === false) ? "hidden" : "flex";
  },[navToggle]);

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
      default:
        component = <SuperHeader  />;
    }

    return component;
  }

  return (
    <div className="layout">
      <header>
        {/* 페이지 별 헤더 변경 */}
        <HeaderStatus loc={navKind} />
        {/* <SuperHeader /> */}
        {/* 로그인 / 로그아웃 버튼 체인지 */}
        {user === null ? 
        <button className="joinBtn" type="button" onClick={() => navigate('/welcome/login')}>Login →</button>
        :
        <MyInfo label={user.USER_NM} className="joinBtn" trigger="hover">
          <div className={layoutStyles.subMenuList}>마이페이지</div>
          <div className={layoutStyles.subMenuList} onClick={()=> {signOut(); window.location.href = "/superMain";}} >로그아웃</div>
        </MyInfo>
        }
      </header>
      <div className="layout_content">
        <main className="varPage">
          {/* Nav 팝업은 여기서 처리 */}
          {(navToggle === false) ? ""
            :
            <Nav user={user} setNavToggle = {setNavToggle} />
          } 
          {/* Outlet에서 페이지 바뀌는거 보일 예정 */}
          <Outlet />
        </main>
        <footer>
          <h2>LERMES</h2>
          {}
          <div onClick={() => navigate('/adminHome')}>관리자 홈</div>
          <div onClick={() => navigate('/tutorHome')}>강사 홈</div>
          <div onClick={() => navigate('/stdHome')}>수강생 홈</div>
        </footer>
      </div>
    </div>
    // onClick={()=> {signOut(); window.location.href = "/superMain";}}
    
  )
}
