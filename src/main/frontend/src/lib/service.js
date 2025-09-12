import axios from "axios";

//// BASE URL: .env 없으면 940 기본값 사용
//const BASE = (import.meta.env?.VITE_BACKEND_API_BASE_URL || "http://localhost:940").replace(/\/$/, "");
//
//
//
//
//
//// 백엔드가 /api/auth 아래에 매핑되어 있다면 이렇게 합쳐서 사용
//export const api = axios.create({
//  baseURL: `${BASE}/api/auth`,
//  withCredentials: true,           // ✅ 세션 쿠키 자동 전송
//  timeout: 10000,                  // 옵션: 타임아웃
//  xsrfCookieName: "XSRF-TOKEN",    // CSRF를 쓰는 경우 대비(현재 개발은 비활성화라면 영향 없음)
//  xsrfHeaderName: "X-XSRF-TOKEN",
//});

export const api = axios.create({
    baseURL: "http://localhost:940/api/auth",
    withCredentials: true,   // ✅ 세션 쿠키 자동 전송
});

// 공통 에러 포맷터(기존 fetch 래퍼의 에러 메시지 체감 비슷하게)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const res = err.response;
    const msg =
      res?.data?.message
        ? String(res.data.message).slice(0, 500)
        : res
          ? `HTTP ${res.status}`
          : err.message || "Network Error";
    const e = new Error(msg);
    e.status = res?.status;
    e.data = res?.data;
    throw e;
  }
);





