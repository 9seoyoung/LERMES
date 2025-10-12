import {api} from "../auth/api";

/**
 * 설문 응답 제출
 * @param {Object} dto {srvySn, parentType = "SURVEY", response = JSON }
 */
export const submitSurvey = (srvySn, dto) => api.post(`/surveys/${srvySn}/responses`, dto, 
    {headers: { 'Content-Type': 'application/json' },}
)

/**
 * 설문 응답 리스트 조회
 * @param {Number} srvySn
 * @returns 관리자 -> 전체 유저 응답, 그 외 -> 본인만
 */
export const pullSurveyResList = (srvySn) => api.get(`surveys/${srvySn}/list`)

/**
 * 설문 응답 삭제 => 관리자 및 본인만
 * @param {Number} srvySn
 */