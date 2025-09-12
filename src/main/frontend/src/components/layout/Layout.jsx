// 라이브러리
import { Outlet } from "react-router-dom"
import { useNavigate } from "react-router-dom"

// 로직

// 스타일

// 페이지
import SuperHeader from "./super/SuperHeader"


// 진짜 레이아웃만 짜놓고, 사용자 정보 받아와서 롤, 기본url 체크 후 세부 컴포넌트에서 디자인 바꿔야 할듯
// 세부 컴포넌트 들 마다 outlet 써야할 듯
function Layout() {
  const navigate = useNavigate();

  return (
    <div className="layout">
      <header>
        <SuperHeader />
        <button className="joinBtn" type="button" onClick={() => navigate('/welcome/login')}>Login →</button>
      </header>
      <div className="layout_content">
        <main className="varPage">
          {/* Nav 팝업은 여기서 처리 */}

          {/* Outlet에서 페이지 바뀌는거 보일 예정 */}
          <Outlet />
        </main>
        <footer>
          ff
        </footer>
      </div>
    </div>
  )
}

export default Layout