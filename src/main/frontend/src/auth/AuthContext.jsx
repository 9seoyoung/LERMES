// 전역 상태 + 헬퍼
import { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import { api } from "../auth/auth.js";

const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  logout: async () => {},
  hasRoleAtLeast: () => false,
  hasAnyRole: () => false,
});
export const useAuth = () => useContext(AuthContext);

// 상태 형태: 서버 /me 응답 기준 (userId, userNm, userAuthrtNo)
const initialState = {
  user: null,        // { userId, userNm, userAuthrtNo } | null
  loading: true,     // 앱 부팅 시 /me 확인 중
};

function reducer(state, action) {
  switch (action.type) {
    case "INIT_START":
      return { ...state, loading: true };
    case "INIT_DONE":  
      return { user: action.payload, loading: false };
    case "LOGIN_SUCCESS":
      return { user: action.payload, loading: false };
    case "LOGOUT":
      return { user: null, loading: false };
    default:
      return state;
  }
}

export function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // 앱 시작 시 세션 확인 (/me)
  useEffect(() => {
    let ignore = false;
    (async () => {
      dispatch({ type: "INIT_START" });
      try {
        const { data } = await api.get("/me");
        if (!ignore) dispatch({ type: "INIT_DONE", payload: data });
      } catch {
        if (!ignore) dispatch({ type: "INIT_DONE", payload: null });
      }
    })();
    return () => { ignore = true; };
  }, []);

  // 로그인/로그아웃 함수
  const login = async ({ userId, password }) => {
    const { data } = await api.post("/login", { email, password });
    console.log("✅ 로그인 응답:", data);
    dispatch({ type: "LOGIN_SUCCESS", payload: data });
    return data;
  };

  const logout = async () => {
    await api.post("/logout");
    dispatch({ type: "LOGOUT" });
  };

  // 권한 체크(숫자 권한이라 가정: 1=관리자 등)
  const hasRoleAtLeast = (minAuthNo) =>
    state.user && typeof state.user.userAuthrtNo === "number"
      ? state.user.userAuthrtNo >= minAuthNo
      : false;

  // 필요한 경우 특정 권한만 허용
  const hasAnyRole = (...authNos) =>
    state.user ? authNos.includes(state.user.userAuthrtNo) : false;

  // 401 자동 로그아웃(선택)
  useEffect(() => {
    const id = api.interceptors.response.use(
      (res) => res,
      (err) => {
        if (err?.response?.status === 401) dispatch({ type: "LOGOUT" });
        return Promise.reject(err);
      }
    );
    return () => api.interceptors.response.eject(id);
  }, []);

  const value = useMemo(() => ({
    user: state.user,
    loading: state.loading,
    login, logout,
    hasRoleAtLeast, hasAnyRole,
  }), [state.user, state.loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

