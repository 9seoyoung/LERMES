import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading, fetchedOnce } = useContext(AuthContext);
  const loc = useLocation();

  if (!fetchedOnce || loading) {
    return <div className="center">로딩...</div>;
  }

  if (!user) {
    return <Navigate to="/welcome/login" replace state={{ from: loc }} />;
  }

  return children ?? <Outlet />;
}