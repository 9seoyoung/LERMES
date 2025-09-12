import axios from "axios";
import { api } from "../lib/service.js";

// 이메일 인증 코드 (중복검사 + 발송)
export const requestEmailCode = (email) =>
  api.post("/email/code", { email });

// 일반 회원가입
export const signupGeneral = (payload) =>
  api.post("/signup", payload);

// 테넌트 회원가입
export const signupTenant = (payload) =>
  api.post("/signup/tenant", payload);

// 로그인
export const login = ({ email, password }) =>
  api.post("/login", { email, password });

// 로그아웃
export const logout = () =>
  api.post("/logout");


// 현재 로그인 사용자
export const fetchMe = () =>
  axios.get("http://localhost:940/api/me", { withCredentials: true });
