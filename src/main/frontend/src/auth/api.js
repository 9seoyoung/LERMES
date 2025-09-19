// src/auth/api.js
import axios from 'axios';

// 배포용

const deployURL = 'onopco2.iptime.org:8080'
// const developURL = 'localhost:940'

export const api = axios.create({
  baseURL: `/api`,
  withCredentials: true, // 세션쿠키 자동 전송
  xsrfCookieName: 'XSRF-TOKEN', // 시큐리티 쿠키 기본 토큰
  xsrfHeaderName: 'X-XSRF-TOKEN', //시큐리티
});

// 공통 에러/세션 만료 처리
let onUnauthorized = null;
export function bindUnauthorizedHandler(fn) {
  onUnauthorized = fn;
}

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401 && onUnauthorized) onUnauthorized();
    // 에러 메시지 정규화
    const msg =
      err?.response?.data?.message || err?.message || '요청 처리 중 오류 발생';
    return Promise.reject(new Error(msg));
  }
);

export default api;
