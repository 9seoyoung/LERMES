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
  return api.post('/board', body, {
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