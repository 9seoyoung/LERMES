import {api} from "../auth/api";

export const createSurvey = (payload) => api.post('/survey/post', payload);
