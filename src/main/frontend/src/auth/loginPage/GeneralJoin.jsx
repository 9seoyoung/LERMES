import React from 'react';
import { useRef, useState } from 'react';
import { requestEmailCode, signupGeneral } from '../authService.js';
import '../../styles/sj.css';
import { toast } from 'react-toastify';

export default function GeneralJoin() {
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
  const emailRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const getErrMsg = (e) =>
    e?.response?.data?.message ||
    e?.response?.data?.error ||
    e?.message ||
    '알 수 없는 오류가 발생했습니다.';

  const sendCode = async () => {
    if (!emailRef.current?.reportValidity()) return;

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
      toast.success(
        setMsg(res?.data?.message || '회원가입 완료! 이제 로그인하세요.')
      );
    } catch (e) {
      toast.error(getErrMsg(e)); // 예: "이메일 인증 실패", "비밀번호가 일치하지 않습니다."
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-inner">
      <div className="signup-title">
        <b>회원가입</b>
      </div>
      <form className="signup-form" onSubmit={onSubmit}>
        <input
          name="username"
          placeholder="이름(국문)"
          value={form.username}
          onChange={onChange}
          required
        />
        <div className="input-with-btn">
          <input
            ref={emailRef}
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
            disabled={sending || !form.email}
          >
            {sending ? '전송중...' : '인증'}
          </button>
        </div>
        <input
          name="verificationCode"
          placeholder="인증번호를 입력하세요."
          value={form.verificationCode}
          onChange={onChange}
          minLength={6}
          maxLength={6}
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
          minLength={11}
          maxLength={11}
          required
        />
        <button className="signup-btn" type="submit" disabled={loading}>
          {loading ? '가입 중...' : '회원가입'}
        </button>
        {msg && <p className="msg">{msg}</p>}
      </form>
    </div>
  );
}
