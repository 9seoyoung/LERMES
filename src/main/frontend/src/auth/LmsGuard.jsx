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
  if (myCompany !== selected) {
    return <Navigate to="/visitorHome" replace />;
  }

  return <Outlet />; 
}