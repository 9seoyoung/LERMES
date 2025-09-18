import { api } from '../auth/api';

// 공통 헬퍼: axios 응답에서 data만 꺼내는 래퍼
const ok = (p) => p.then(({ data }) => data);

// 강사: 출결 코드 생성
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"코드 생성 완료 65" } */
export const createAttendCode = (payload) =>
  ok(api.post('/attend/code', payload));

// export const createAttendCode = (payload) =>
//   api.post('/attend/code', payload).then((res) => res.data);

// 학생: 입실
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"입실", checkinTime:"2025-09-15T15:02:21.4331259" } */
export const checkin = (payload) => ok(api.post('/attend/checkin', payload));

// 학생: 퇴실
/* 1. 실패: { ok:false, message:"실패 에러 메시지" }
   2. 성공: { ok:true, message:"퇴실", checkoutTime:"2025-09-15T15:06:16.0482305" } */
export const checkout = () => ok(api.post('/attend/checkout'));

// 학생 당일 입퇴실시간 데이터 가져오는 함수
export const getTodayStatus = () => ok(api.get('/attend/status/today'));

// 강사가 만든 코드, 강사랑 학생한테 보여주는 함수
export const getActiveAttendCode = () => ok(api.get('/attend/code'));
