import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { login } from '../auth';
import "../../styles/sj.css"
import { toast } from 'react-toastify';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [msg, setMsg] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const loc = useLocation();
  
    const onSubmit = async (e) => {
      e.preventDefault();
      setMsg(null);
      setLoading(true);
      try {
          const {data} = await login({ email: email.trim().toLowerCase(), password });
          console.log(data);
          navigate(`/${data.path}`, { replace: true });
//        await login({ email: email.trim().toLowerCase(), password });
//        navigate('/superMain', { replace: true });
        toast.success("로그인 성공!")
      } catch (err) {
        toast.error(setMsg(err.message || '로그인 실패'));
      } finally {
        setLoading(false);
      }
    };

  return (
            <div className='contBox'>
          <div className="signup-inner">
            <div className="signup-title" style={{}}>로그인</div>
            <form className="signup-form" onSubmit={onSubmit}>
              <input
                type="email"
                placeholder="이메일을 입력하세요. ex) xxxx123@example.com"
                className="input" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="비밀번호를 입력하세요."
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button className="signup-btn" type="submit" >
                {loading ? '로그인 중...' : '로그인'}
              </button>
              <hr></hr>
                <Link to="/signup" className='problemBox'> 아이디가 없어요</Link>
                <Link to="#" className="findIdPw"><span>ID/PW 를 잊어버렸어요</span></Link>
            </form>
            </div>
          </div>
  );
}

export default Login;