import { Navigate, Outlet } from "react-router-dom";
import { useAccount } from "./AuthContext";

export default function LmsAuth() {
  const { user, loading } = useAccount();
  if (loading) return null;
  if (!user) return <Navigate to="/visitorHome" replace />;
  return <Outlet />;
}