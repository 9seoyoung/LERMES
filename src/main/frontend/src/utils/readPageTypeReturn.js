import { readInterviewList, readInterviewListByCoSn } from "../services/postService";

export function matchedPathAdminBoardFilter (filter) {
  switch (filter) {
    case "공지":
      return 

    case "일정":
      return 
      
    case "자료실":
      return 

    case "설문":
      return 

    case "FAQ":
      return 
      
    case "Q&A":
      return 

    case "면담요청":
      return "/adminHome/boardSet/readInterview"

    case "면담기록":
      return 
      
    case "임시저장":
      return 

    case "공지":
      return 

    case "공지":
      return 
      
    case "공지":
      return 
  
      
  }
}

export function matchedListAPIAdminBoardFilter (filter) {
  let handleListApi;

  switch (filter) {
    case "공지":
      return

    case "일정":
      return 
      
    case "자료실":
      return 

    case "설문":
      return 

    case "FAQ":
      return 
      
    case "Q&A":
      return 

    case "면담요청":
      return handleListApi = readInterviewList

    case "면담기록":
      return 
      
    case "임시저장":
      return 

    case "공지":
      return 

    case "공지":
      return 
      
    case "공지":
      return 
  
      
  }
}