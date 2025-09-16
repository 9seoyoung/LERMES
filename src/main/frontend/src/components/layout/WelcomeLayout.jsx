// 라이브러리
import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { fetchMe } from "../../auth/authService";

// 스타일
import "../../styles/sj.css";

// 컴포넌트
import WelcomePromotion from "./super/WelcomePromotion";

function WelcomeLayout() {
  const [Action, setAction] = useState("basic");
  const navigate = useNavigate();

  console.log(fetchMe);

  return (
    <div className="welcomeCont">
      <header className="headerLogo" onClick={() => navigate('/')}>
        <img  src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
      </header>
      <div className="main-container">
        <div className="panel left-panel">
          <div className="welcome-inner">
            <div className="welcome-title">
              <b>LMS에 오신 것을<br />환영합니다 ~</b>
            </div>
            <div className="welcome-desc">글</div>
            <div className="welcome-sub">
              더욱 체계적인, 맞춤화 된 환경으로<br />
              교육의 질을 높여보세요!
            </div>
            <button type="button" className="start-btn" onClick={()=> {setAction("join"); navigate('/welcome/generalJoin')}}>시작하기</button>
          </div>
        </div>
        <div className="panel right-panel">
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  );
}

export default WelcomeLayout;
