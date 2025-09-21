import {api} from "../auth/api";

export function createSurvey(body) {
  return api.post('/survey/post', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}

// export const createGroup = (payload) => api.post('/cohort/setgroup', payload)
export function createGroup(body) {
  return api.post('/cohort/setgroup', body, {
    headers: { 'Content-Type': 'application/json' },
  });
}