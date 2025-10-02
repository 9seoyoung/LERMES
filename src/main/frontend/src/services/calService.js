import {api} from "../auth/api.js";


// 일정 조회(SchedList에서 땡겨옴)
export const pullToDoList = (params) => api.get('/calender',params);


//일정 등록(SchedListPopUp & 게시글)
export const registToDo = (payload) => api.post('/calander', {payload});