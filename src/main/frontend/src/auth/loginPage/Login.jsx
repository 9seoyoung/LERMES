function Login() {
  return (
    <div className="container">
      <div className="image-logo">
        <span role="img" aria-label="logo"></span>
        <span style={{ fontWeight: 700, fontSize: "2rem", letterSpacing: "0.1em" }}>LERMES</span>
      </div>

      <div className="wrapper">
        <div className="left-box">
          <span className="drawing-text">그림</span>
        </div>

        <div className="right-box">
          <form className="login-form">
            <div className="title">LMS</div>
            <input type="email" placeholder="이메일을 입력하세요. ex) xxxx123@example.com" className="input" />
            <input type="password" placeholder="비밀번호를 입력하세요." className="input" />
            <button type="submit" className="login-button">로그인 ➔</button>
            <div className="find-section">아이디가 없어요</div>
            <a href="#" className="find-link">ID/PW 를 잊어버렸어요</a>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;