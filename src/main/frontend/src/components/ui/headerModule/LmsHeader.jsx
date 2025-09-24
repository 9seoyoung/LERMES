import { useLocation, useNavigate } from "react-router-dom";
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";
import { ChevronLeft, ChevronRight } from "lucide-react";

        
export default function LmsHeader({ loc ,navToggle, setNavToggle, children }) {
  const { clearFixedSn, effectiveSn } = useSelectedCompany();
  const { user } = useAccount();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const navKind = pathname.split('/', 2)[1] || pathname.split('/',2)[1];
  console.log(`${navKind} navKind가 가리키는 위치`)

  if(!user) {
    navigate('/', {redirect: true});
  }
  return (
    <>
      <div className="header_L">
        <button
          className="navBtn"
          type="button"
          onClick={() => setNavToggle(!navToggle)}
        >
          {navToggle ? <ChevronLeft size={24} /> : <ChevronRight size={24} />}
        </button>

        {/* 회사 로고/이름 영역 */}
        <div
          className="logoBox"
          onClick={() => {
            clearFixedSn();
            navigate(`/${loc}`);
            console.log(user);
          }}
        >
          <h2>{ effectiveSn || user?.CO_SN}</h2>
          {(user?.USER_AUTHRT_SN === 1 || user?.USER_AUTHRT_SN === 2) && (
            <button className="tempBtn basicBtn">로고 변경</button>
          )}
        </div>
      </div>
      <>{children}</>
      {console.log("이거 호출됨", navKind)}
  </>
);
}
