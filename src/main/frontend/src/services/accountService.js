import {api} from "../auth/api"

export const pullAllAccount = (effectiveSn) => api.get('/users', effectiveSn);

export const deleteAccount = (id) => api.delete(`/${id}`, id)

export const applyEmp = (params) => api.post('/company-members/apply', params , {
  headers: { "Content-Type": "application/json" }});

export const pullApplyEmp = (effectiveSn) => api.get('/company-members', effectiveSn);