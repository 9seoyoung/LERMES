import { use, useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAccount } from '../AuthContext'; // ← 컨텍스트 훅
import '../../styles/sj.css';
import { toast } from 'react-toastify';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAccount(); // ← login + fetchMe 묶음
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 중복 클릭 방지
    setLoading(true);
    try {
      const me = await signIn({ email: email.trim().toLowerCase(), password });
      toast.success('로그인 성공!');

      // 1순위: 보호 페이지에서 온 경로, 2순위: 서버가 주는 HOME_PATH, 3순위: 디폴트
      const from = location.state?.from?.pathname;
      const byHome = me?.HOME_PATH
        ? me.HOME_PATH.startsWith('/')
          ? me.HOME_PATH
          : `/${me.HOME_PATH}`
        : null;
      navigate(from ?? byHome ?? '/', { replace: true });
    } catch (err) {
      toast.error(err?.message || '로그인 실패');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contBox">
      <div className="signup-inner">
        <div className="signup-title">로그인</div>
        <form className="signup-form" onSubmit={onSubmit}>
          <input
            type="email"
            placeholder="이메일을 입력하세요. ex) xxxx123@example.com"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
          <input
            type="password"
            placeholder="비밀번호를 입력하세요."
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
          <button className="signup-btn" type="submit" disabled={loading}>
            {loading ? '로그인 중...' : '로그인'}
          </button>
          <hr />
          <Link to="/signup" className="problemBox">
            아이디가 없어요
          </Link>
          <Link to="/find" className="findIdPw">
            <span>ID/PW 를 잊어버렸어요</span>
          </Link>
        </form>
      </div>
    </div>
  );
}
