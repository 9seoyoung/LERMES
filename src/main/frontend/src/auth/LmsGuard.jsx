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

    const authLvPath = {
      1: "adminHome",
      2: "adminHome",
      3: "adminHome",
      4: "tutorHome",
      5: "stdHome",
      6: "visitorHome",
      7: "visitorHome"
    }

    const arrive = authLvPath?.myCoAuth;

    if (authLvPath?.[myCoAuth]) {

    <Navigate to = {`${arrive}`} replace></Navigate>
    } else {
      <Navigate to = '/visitorHome' replace></Navigate>
    }

  }

  return <Outlet />; 
}