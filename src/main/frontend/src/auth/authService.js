// src/auth/authService.js
import { api } from './api';

// 공통 헬퍼: axios 응답에서 data만 꺼내는 래퍼
const ok = (p) => p.then(({ data }) => data.data);

// 이메일 인증 코드 (중복검사 + 발송)
export const requestEmailCode = (email) =>
  ok(api.post('/email/code', { email }));

// 일반 회원가입
export const signupGeneral = (payload) => ok(api.post('/signup', payload));

// 테넌트 회원가입
export const signupTenant = (payload) =>
  ok(api.post('/signup/tenant', payload));

// 로그인 (세션 수립)
export const login = ({ email, password }) =>
  ok(api.post('/login', { email, password }));

// 로그아웃
export const logout = () => ok(api.post('/logout'));

// 현재 로그인 사용자
export const fetchMe = () => ok(api.get('/me'));

export const saveProfile = (form) => ok(api.put('/profile', form));

// 아이디 찾기
export const findId = (payload) =>
  api.post('/find-id', payload).then((res) => res.data);

// 비밀번호 재설정용 코드 발송
export const sendPasswordResetCode = (payload) =>
  api.post('/new-password/code', payload).then((res) => res.data);

// 새 비밀번호 설정
export const resetPassword = (payload) =>
  api.post('/new-password/confirm', payload).then((res) => res.data);
