import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "./AuthContext";

export default function RoleRoute({ roles = [] }) {
  const { user, hasRole, fetchedOnce } = useAccount();
  const loc = useLocation();

  if (!fetchedOnce) return null; // 최초 fetchMe 완료 전 렌더 막기
  if (!user) return <Navigate to="/login" replace state={{ from: loc }} />;
  if (roles.length && !hasRole(roles)) return <Navigate to="/403" replace />;
  return <Outlet />;
}
