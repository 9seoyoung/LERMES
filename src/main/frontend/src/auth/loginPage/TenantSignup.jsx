import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { requestEmailCode, signupTenant } from '../authService.js';
import styles from '../../styles/SignUp.module.css';
import { useAccount } from '../AuthContext.jsx';
import FilePreview from '../../components/ui/FilePreview.jsx';
import { toast } from 'react-toastify';

export default function TenantSignup() {
  const navigate = useNavigate();
  const { signIn } = useAccount();
  const [form, setForm] = useState({
    username: '',
    email: '',
    verificationCode: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    companyName: '',
    businessNumber: '',
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const emailRef = useRef(null);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const sendCode = async () => {
    if (!emailRef.current?.reportValidity()) return;

    const normEmail = form.email.trim().toLowerCase();
    setSending(true);
    setMsg(null);
    try {
      await requestEmailCode(normEmail);
      setForm((f) => ({ ...f, email: normEmail }));
      setCodeSent(true);
      setMsg('인증코드를 전송했습니다.');
    } catch (e) {
      setMsg(e.message || '인증코드 전송 실패');
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);

    if (form.password !== form.confirmPassword) {
      return setMsg('비밀번호가 일치하지 않습니다.');
    }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        verificationCode: form.verificationCode.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber.trim(),
        companyName: form.companyName.trim(),
        businessNumber: form.businessNumber.trim(),
      };

      await signupTenant(payload);

      const loginPayload = { email: payload.email, password: payload.password };
      const me = await signIn(loginPayload);
      toast.success("회원가입 완료!")
      const redirectLoc = `/${me?.HOME_PATH}` || '/';
      navigate(redirectLoc, { replace: true });
    } catch (e) {
      setMsg(e.message || '테넌트 등록 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-inner">
      <div className="signup-title">비즈니스 회원가입</div>
      <form className="signup-form" onSubmit={onSubmit}>
        <div className={styles.logo}>
          <FilePreview />
          <div className={styles.imgCaption}>*이미지 크기 180px X 60px</div>
        </div>

        <input
          name="companyName"
          placeholder="회사명"
          value={form.companyName}
          onChange={onChange}
          required
        />
        <input
          name="businessNumber"
          placeholder="사업자등록번호"
          minLength={10}
          maxLength={10}
          value={form.businessNumber}
          onChange={onChange}
          required
        />

        <input
          name="username"
          type="text"
          placeholder="이름(국문)"
          value={form.username}
          onChange={onChange}
          required
          autoComplete="off"
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
            autoComplete="email"
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
          placeholder="인증코드"
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

        {/* ✔ 전체 required 검사 사용하려면 submit 버튼 권장 */}
        <button type="submit" disabled={loading} className="signup-btn">
          {loading ? '등록 중...' : '회원 가입'}
        </button>

        {msg && <p className="msg">{msg}</p>}
      </form>
    </div>
  );
}
