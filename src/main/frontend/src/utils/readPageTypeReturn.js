import { readInterviewList, readInterview } from "../services/postService";


const PATH_BY_FILTER = {
  // '공지': readNoticeList,
  // '일정': readScheduleList,
  // '자료실': readDocsList,
  // '설문': readSurveyList,
  // 'FAQ': readFaqList,
  // 'Q&A': readQnaList,
  '면담요청': "/adminHome/boardSet/readInterview",
  // '면담기록': readInterviewListByCoSn,
  // '임시저장': readDraftList,
};

const API_BY_FILTER = {
  // '공지': readNoticeList,
  // '일정': readScheduleList,
  // '자료실': readDocsList,
  // '설문': readSurveyList,
  // 'FAQ': readFaqList,
  // 'Q&A': readQnaList,
  '면담요청': readInterviewList,
  // '면담기록': "",
  // '임시저장': readDraftList,
};

const DETAIL_API_BY_FILTER = {
  // '공지': readNoticeList,
  // '일정': readScheduleList,
  // '자료실': readDocsList,
  // '설문': readSurveyList,
  // 'FAQ': readFaqList,
  // 'Q&A': readQnaList,
  '면담요청': readInterview,
  // '면담기록': ,
  // '임시저장': readDraftList,
};


export function matchedPathAdminBoardFilter (filter) {
  return PATH_BY_FILTER[filter] || "" ; //없으면 빈값 (현재페이지)
  }
  
export function matchedListAPIAdminBoardFilter(filter) {
  return API_BY_FILTER[filter] || ""; // 없으면 null
}

export function matchedPostAPIAdminBoardFilter(filter) {
  return DETAIL_API_BY_FILTER[filter] || ""; // 없으면 null
}