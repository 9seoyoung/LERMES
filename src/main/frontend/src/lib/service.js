import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:940/api",
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





