import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../auth/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const loc = useLocation();
  const from = loc.state?.from || '/';

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(null);
    setLoading(true);
    try {
      await login({ email: email.trim().toLowerCase(), password });
      navigate(from, { replace: true });
    } catch (err) {
      setMsg(err.message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  //   const onSubmit = async (e) => {
  //   e.preventDefault();
  //   setMsg(null);
  //   setLoading(true);

  //   try {
  //     const res = await login({
  //       email: email.trim().toLowerCase(),
  //       password
  //     });

  //     if (res.data.ok) {
  //       // ✅ path 꺼내기
  //       const nextPath = res.data.data.path;
  //       navigate("/" + nextPath, { replace: true });
  //     } else {
  //       setMsg(res.data.message || "로그인 실패");
  //     }
  //   } catch (err) {
  //     setMsg("로그인 오류: " + (err.response?.data?.message || err.message));
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div className="container split">
      <form className="card" onSubmit={onSubmit}>
        <h2>로그인</h2>

        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button disabled={loading}>
          {loading ? '로그인 중...' : '로그인'}
        </button>

        {msg && <p className="msg error">{msg}</p>}

        <div className="msg" style={{ marginTop: 12 }}>
          <Link to="/signup">일반 회원가입</Link> ·{' '}
          <Link to="/signup/tenant">테넌트 회원가입</Link>
        </div>
      </form>
    </div>
  );
}
