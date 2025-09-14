import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAccount } from "../AuthContext"; // ← 컨텍스트 훅
import "../../styles/sj.css";
import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAccount(); // ← login + fetchMe 묶음
  const navigate = useNavigate();
  const loc = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    if (loading) return; // 중복 클릭 방지
    setLoading(true);
    try {
      const me = await signIn({ email: email.trim().toLowerCase(), password });
      toast.success("로그인 성공!");

      // 이전 페이지 복귀 or role 기반 분기
      const pathByRole = { "1": "/superMain", "2": "/adminHome", "3": "/adminHome", "4": "/tutorHome", "5": "/stdHome" };
      const fallback = pathByRole[String(me.user_authrt_no)] || "/";
      const to = loc.state?.from?.pathname || me.path || fallback;

      navigate(to, { replace: true });
    } catch (err) {
      const msg = err?.message || "로그인 실패";
      toast.error(msg);
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
            {loading ? "로그인 중..." : "로그인"}
          </button>
          <hr />
          <Link to="/signup" className="problemBox">아이디가 없어요</Link>
          <Link to="/find" className="findIdPw"><span>ID/PW 를 잊어버렸어요</span></Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
