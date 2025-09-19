import { useEffect, useState } from "react";
import { fetchMe } from "../lib/auth";

export default function ProtectedRoute({ children }) {
  const [ok, setOk] = useState(null);
  useEffect(() => { fetchMe().then(()=>setOk(true)).catch(()=>setOk(false)); }, []);
  if (ok === null) return <div className="center">로딩...</div>;
  return children;
}
