import { api } from "../auth/api.js";

export const pullAllCompany = () => api.get('/company');