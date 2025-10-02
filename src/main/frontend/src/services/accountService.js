import {api} from "../auth/api"


export const pullAllAccount = (effectiveSn) => api.get('/users', effectiveSn);

export const deleteAccount = (id) => api.delete(`/${id}`, id)