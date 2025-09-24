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
 * 
 * @param {Object} params
 * @param {Number} itvSn 면담신청SN
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값 => 상준이가 수퍼메인페이지 API 만들고 나면 정해질 예정
 * @returns {Object} itvSn 에 해당하는 면담신청 데이터
 */
export const readInterview = (itvSn) => api.get(`/read/${itvSn}`);

  // 면담신청 리스트 조회(관리자)
// postService.js
export const readInterviewList = ({ roleType, cohortSn }) => {
  // INSTRUCTOR(4): cohortSn 없으면 /my-requests
  // TENANT/EMPLOYEE(2/3): cohortSn 필수 → /my-requests/{cohortSn}
  const base = '/interview/my-requests';
  const url = (roleType === 4 && !cohortSn)
    ? `${base}`
    : `${base}/${cohortSn}`;
  return api.get(url); // filter는 쓰면 되고, 안 쓰면 백에서 무시 가능
};


/**
 * 면담 수정(확정) API 
 * @param {Number} itvSn 면담신청SN
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값
 * @param {Object} formData 변경(확정)된 내용
 * @returns 1
 */
export function editInterview( itvSn, effectiveSn, formData ) {
  return api.post(`/interview/edit/${itvSn}/${effectiveSn}`, formData, {
      headers: { 'Content-Type': 'application/json' },
    }
  );
}

/**
 * 관리자 게시글 관리 메뉴 - 전체 게시글 리스트(모집공고 제외)
 * 
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값 => 상준이가 수퍼메인페이지 API 만들고 나면 정해질 예정
 * @returns {Array<Object>>} 전체 게시글 응답
 */
export const readAllOfPostList = ({effectiveSn}) => api.get('/posts/all', {params: {effectiveSn}});

/**
 * 관리자 게시글 관리 메뉴 - 필터링 게시글 리스트
 * @param {string} [filter] - 필터링 기준 (게시글 유형: 공지 / 일정 / 자료실 / 설문 / FAQ / Q&A / 면담요청 / 면담기록  )
 * @param {Number} effectiveSn LMS 회사 시리얼 넘버 고정값 => 상준이가 수퍼메인페이지 API 만들고 나면 정해질 예정
 * @returns {Array<Object>} 전체 게시글 중 필터링 된 것
 */
export const readPostlistByfilter = ({filter, effectiveSn}) => api.get('/posts/list/{filter}',{params: {filter, effectiveSn}});

/**
 * 게시글 상세보기
 * @param {Number} postSn 게시글 시리얼번호
 * @returns {Object} 게시글 내용
 */
export const readPostByPostSn = ({postSn, effectiveSn}) => api.get('/posts/list/{filter}',{params: {postSn, effectiveSn}});
