import {api} from "../auth/api";

export function createSurvey(body) {
  return api.post('/survey/post', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

// export const createGroup = (payload) => api.post('/cohort/setgroup', payload)
export function createGroup(body) {
  return api.post('/cohorts/setgroup', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createPost(body) {
  return api.post('/board/post', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createInterview(body) {
  return api.post('/interview/apply', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

export function createInterviewMemo(body) {
  return api.post('/interview/memo', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

/**
 * 관리자 게시글 관리 메뉴
 * @returns {Array<Object>>} 전체 게시글 응답
 */
export const readAllOfPostList = (id) => api.get('/posts/all');

/**
 * 관리자 게시글 관리 메뉴
 * @param {string} [filter] - 필터링 기준 (게시글 유형: 공지 / 일정 / 자료실 / 설문 / FAQ / Q&A / 면담 / 임시저장 )
 * @returns {Array<Object>} 전체 게시글 중 필터링 된 것
 */
export const readPostByPostSn = () => api.get('/posts/all?filter=${ filter }');