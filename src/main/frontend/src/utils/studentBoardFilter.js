// 수강생 권한 / 학습 일정 메뉴 필터별 url

import { readInterview } from "../services/postService"

export const STUDENT_BOARD_MENU_FILTER = {
    // key는 선택한 필터의 인덱스 (=selectedIdx)
    0: null, // 전체
    1: "NOTICE", // 공지
    2: "CLASS_MATERIAL", //자료실
    3: "SURVEY", //설문
    4: "FAQ", //FAQ
    5: "QNA", //Q&A
    6: "PRIVATE" //임시저장
}

export const BOARD_MENU_FILTER_COLUMNDATA = {
    0: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    1: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    2: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    3: ["bbsType", "srvyTtl", "formattedAPostFrstDt", "userNm", "viewCnt"],
    4: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    5: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"],
    6: ["bbsType", "postTtl", "formattedAPostFrstDt", "postWriterName", "viewCnt"]
}

export const SELECT_POST_SN_KEY = {
    0: "postSn",
    1: "postSn",
    2: "postSn",
    3: "srvyTtl",
    4: "postSn",
    5: "postSn",
    6: "postSn"
}

export const SELECT_DETAIL_PAGE_PATH = {
    0: 0,
    1: "/stdHome/board",
    2: "/stdHome/board",
    3: "/stdHome/board",
    4: "/stdHome/board", //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
    5: "/stdHome/board",
    6: ""

}