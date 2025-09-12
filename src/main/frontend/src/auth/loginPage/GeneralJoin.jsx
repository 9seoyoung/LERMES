import React from "react";
import { useState } from 'react';
import { requestEmailCode, signupGeneral } from '../auth';
import "../../styles/sj.css";
// import logoImg from './1.png';

function GeneralJoin() {
  const [form, setForm] = useState({
      username: '',
      email: '',
      verificationCode: '',
      password: '',
      confirmPassword: '',
      phoneNumber: '',
    });
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [codeSent, setCodeSent] = useState(false);
  
    const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  
    const getErrMsg = (e) =>
      e?.response?.data?.message ||
      e?.response?.data?.error ||
      e?.message ||
      '알 수 없는 오류가 발생했습니다.';
  
    const sendCode = async () => {
      const normEmail = form.email.trim().toLowerCase();
      if (!normEmail) return setMsg('이메일을 입력하세요.');
      setSending(true);
      setMsg(null);
      try {
        await requestEmailCode(normEmail); // 200 OK or 409 CONFLICT 등
        setForm((f) => ({ ...f, email: normEmail }));
        setCodeSent(true);
        setMsg('인증코드를 전송했습니다.');
      } catch (e) {
        setMsg(getErrMsg(e)); // 예: "이미 가입된 이메일입니다."
      } finally {
        setSending(false);
      }
    };
  
    const onSubmit = async (e) => {
      e.preventDefault();
      setLoading(true);
      setMsg(null);
      try {
        const payload = {
          username: form.username.trim(),
          email: form.email.trim().toLowerCase(),
          verificationCode: form.verificationCode.trim(),
          password: form.password,
          confirmPassword: form.confirmPassword,
          phoneNumber: form.phoneNumber.trim(),
        };
        const res = await signupGeneral(payload); // 성공 시 200 OK
        setMsg(res?.data?.message || '회원가입 완료! 이제 로그인하세요.');
      } catch (e) {
        setMsg(getErrMsg(e)); // 예: "이메일 인증 실패", "비밀번호가 일치하지 않습니다."
      } finally {
        setLoading(false);
      }
    };

  return (
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
            <form className="signup-form" onSubmit={onSubmit} noValidate>
              <input
                name="username"
                placeholder="이름(국문)"
                value={form.username}
                onChange={onChange}
                required
              />
              <div className="input-with-btn">
                <input
                  name="email"
                  type="email"
                  placeholder="이메일을 입력하세요. ex) abc123@example.com"
                  value={form.email}
                  onChange={onChange}
                  required
                  disabled={codeSent}
                  />
                <button
                type="button"
                className="verify-btn"
                onClick={sendCode}
                disabled={sending || !form.email}>
                  {sending ? '전송중...' : '인증'}
                </button>
              </div>
              <input
                name="verificationCode"
                placeholder="인증번호를 입력하세요."
                value={form.verificationCode}
                onChange={onChange}
                required
              />
              <input
                name="password"
                type="password"
                placeholder="비밀번호"
                value={form.password}
                onChange={onChange}
                required
              />
              <input
                name="confirmPassword"
                type="password"
                placeholder="비밀번호 확인"
                value={form.confirmPassword}
                onChange={onChange}
                required
              />
              <input
                name="phoneNumber"
                placeholder="휴대폰번호"
                value={form.phoneNumber}
                onChange={onChange}
                required
              />
              <button className="signup-btn" type="submit" disabled={loading}>
                {loading ? '가입 중...' : '회원가입'}
              </button>
              {msg && <p className="msg">{msg}</p>}
            </form>
          </div>
        </div>
      </div>
  );
}

export default GeneralJoin;
