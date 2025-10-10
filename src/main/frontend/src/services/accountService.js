import {api} from "../auth/api"

export const pullAllAccount = (params) => api.get('/users/by-company-role', {params});

export const deleteAccount = (id) => api.delete(`/${id}`, id)

export const applyEmp = (params) => api.post('/company-members/apply', params , {
  headers: { "Content-Type": "application/json" }});

export const pullApplyEmp = (effectiveSn) => api.get('/company-members', effectiveSn);

/**
 * 
 * @param {Number} ogdpCoSn
 * @param {Number} ogdpCohortSn
 * @param {Number} userAuthrtSn
 * @returns 
 */
export const pullTeacherAccount = (params) => api.get("/users/by-company-cohort-role",{params})