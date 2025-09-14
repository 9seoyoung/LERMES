// src/auth/AuthProvider.jsx
import { useEffect, useReducer, useMemo } from "react";
import { authReducer, initialAuthState } from "./authReducer";
import { AuthContext } from "./AuthContext";
import { bindUnauthorizedHandler } from "./api";
import { fetchMe, login, logout } from "./authService";

export default function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);

  // 앱 부팅 시 한 번: 세션 유효하면 유저 로드
  useEffect(() => {
    (async () => {
      dispatch({ type: "ME_LOADING" });
      try {
        const { data } = await fetchMe();
        dispatch({ type: "ME_SUCCESS", payload: data });
      } catch {
        dispatch({ type: "ME_ANON" });
      }
    })();
  }, []);

  // 401 발생 시(세션 만료 등) → 전역 로그아웃 처리
  useEffect(() => {
    bindUnauthorizedHandler(() => {
      dispatch({ type: "ME_ANON" });
    });
  }, []);

  const signIn = async (cred) => {
    await login(cred);                 // ✅ 서버 세션 수립
    dispatch({ type: "LOGIN_SUCCESS" });
    const { data } = await fetchMe();  // ✅ 즉시 me로 유저확정
    dispatch({ type: "ME_SUCCESS", payload: data });
    return data; // 필요하면 호출처에서 path/role 보고 navigate
  };

  const signOut = async () => {
    try { await logout(); } catch(e) { console.error(e)}
    dispatch({ type: "LOGOUT" });
  };

  const refreshMe = async () => {
    dispatch({ type: "ME_LOADING" });
    try {
      const { data } = await fetchMe();
      dispatch({ type: "ME_SUCCESS", payload: data });
      return data;
    } catch (e) {
      dispatch({ type: "ME_ANON" });
      throw e;
    }
  };

  const hasRole = (roles) => {
    const r = state.user?.user_authrt_no?.toString();
    return !!r && roles.map(String).includes(r);
  };

  const value = useMemo(
    () => ({
      user: state.user,
      loading: state.loading,
      fetchedOnce: state.fetchedOnce,
      signIn,
      signOut,
      refreshMe,
      hasRole,
    }),
    [state]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
