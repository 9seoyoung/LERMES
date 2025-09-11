import React from "react";
import "../../styles/sj.css";
// import logoImg from './1.png';

function GeneralJoin() {
  return (
    <div className="app-bg">
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
            <button className="start-btn">시작하기</button>
          </div>
        </div>
        <div className="panel right-panel">
          <div className="signup-inner">
            <div className="signup-title">
              <b>회원가입</b>
            </div>
            <form className="signup-form">
              <input type="text" placeholder="이름을 입력하세요. (국문 표기)" />
              <div className="input-with-btn">
                <input type="email" placeholder="이메일을 입력하세요. ex) abc123@example.com" />
                <button type="button" className="verify-btn">인증</button>
              </div>
              <input type="text" placeholder="인증 번호를 입력하세요." />
              <input type="password" placeholder="비밀번호 입력" />
              <input type="password" placeholder="비밀번호 확인" />
              <input type="text" placeholder="휴대폰 번호를 입력하세요. 010-xxxx-xxxx" />
              <button className="signup-btn" type="submit">회원 가입</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralJoin;
