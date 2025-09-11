// src/pages/TenantSignup.jsx
import { useState } from "react";
import { requestEmailCode, signupTenant } from "../lib/auth";

export default function TenantSignup() {
  const [form, setForm] = useState({
    username: "", email: "", verificationCode: "",
    password: "", confirmPassword: "", phoneNumber: "",
    companyName: "", companyNumber: ""
  });
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const onChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const sendCode = async () => {
    const normEmail = form.email.trim().toLowerCase();
    if (!normEmail) return setMsg("관리자 이메일을 입력하세요.");
    setSending(true); setMsg(null);
    try {
      await requestEmailCode(normEmail, "TENANT");
      setForm(f => ({ ...f, email: normEmail }));
      setCodeSent(true);
      setMsg("인증코드를 전송했습니다.");
    } catch (e) { setMsg(e.message); }
    finally { setSending(false); }
  };

  const onSubmit = async (e) => {
    e.preventDefault(); setLoading(true); setMsg(null);
    try {
      const payload = {
        username: form.username.trim(),
        email: form.email.trim().toLowerCase(),
        verificationCode: form.verificationCode.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
        phoneNumber: form.phoneNumber.trim(),
        companyName: form.companyName.trim(),
        companyNumber: form.companyNumber.trim()
      };
      await signupTenant(payload);
      setMsg("회사 등록(테넌트) 완료! 이제 로그인하세요.");
    } catch (e) { setMsg(e.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="center">
      <form className="card" onSubmit={onSubmit}>
        <h2>테넌트 회원가입</h2>

        <input name="companyName" placeholder="회사명"
               value={form.companyName} onChange={onChange} required />
        <input name="companyNumber" placeholder="사업자등록번호"
               value={form.companyNumber} onChange={onChange} required />

        <input name="username" placeholder="관리자 이름"
               value={form.username} onChange={onChange} required />

        <div className="row">
          <input name="email" type="email" placeholder="관리자 이메일"
                 value={form.email} onChange={onChange}
                 required disabled={codeSent} />
          <button type="button" className="btn-secondary"
                  onClick={sendCode} disabled={sending || !form.email}>
            {sending ? "전송중..." : "인증"}
          </button>
        </div>

        <input name="verificationCode" placeholder="인증코드"
               value={form.verificationCode} onChange={onChange} required />

        <input name="password" type="password" placeholder="비밀번호"
               value={form.password} onChange={onChange} required />
        <input name="confirmPassword" type="password" placeholder="비밀번호 확인"
               value={form.confirmPassword} onChange={onChange} required />

        <input name="phoneNumber" placeholder="관리자 휴대폰번호"
               value={form.phoneNumber} onChange={onChange} required />

        <button disabled={loading}>{loading ? "등록 중..." : "테넌트 등록"}</button>
        {msg && <p className="msg">{msg}</p>}
      </form>
    </div>
  );
}
