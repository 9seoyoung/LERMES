// src/auth/RoleRoute.jsx
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAccount } from "./AuthContext";

export default function RoleRoute({ roles = [] }) {
  const { user, loading, hasRole, fetchedOnce } = useAccount();
  const loc = useLocation();

  if (loading && !fetchedOnce) return null; // 스켈레톤/스피너 추천

  if (!user) {
    return <Navigate to="/login" replace state={{ from: loc }} />;
  }
  if (roles.length && !hasRole(roles)) {
    return <Navigate to="/403" replace />;
  }
  return <Outlet />; // 통과
}
