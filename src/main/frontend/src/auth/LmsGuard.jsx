import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "../auth/AuthContext";
import { useSelectedCompany } from "../contexts/SelectedCompanyContext";

export default function LmsGuard() {
  const { user, loading } = useAccount();
  const { effectiveSn } = useSelectedCompany();

  if (loading) return null;
  if (!user) return <Navigate to="/visitorHome" replace />;

  const myCompany = Number(
    user?.USER_OGDP_CO_SN ?? user?.user_ogdp_co_sn ?? user?.userOgdpCoSn ?? NaN
  );
  const selected = Number(effectiveSn ?? NaN);

  // 남의 회사
  if (myCompany != selected) {
    return <Navigate to="/visitorHome" replace />;
  }

  // 내회사
  if(myCompany === selected) {
    const myCoAuth = user.USER_AUTHRT_SN;

    switch (myCoAuth) {
      case 2:
        return <Navigate to="/adminHome" replace />;
      case 3:
        return <Navigate to="/adminHome" replace />;
      case 4:
        return <Navigate to="/tutorHome" replace />;
      case 5:
        return <Navigate to="/stdHome" replace />;
      
        default:
          return <Navigate to="/visitorHome" replace />;
    }
  }



  return <Outlet />; 
}