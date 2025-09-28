// 수강생 권한 / 학습 일정 메뉴 필터별 url

import { readInterview } from "../services/postService"

export const STUDENT_STUDY_MENU_FILTER = {
    // key는 선택한 필터의 인덱스 (=selectedIdx)
    0: "", // 전체
    1: "", // 공식
    2: "", //내 일정
    3: "", //학습 일지
    4: "/interview/my-requests", //면담
    5: "" //임시저장
}

export const MENU_FILTER_COLUMNDATA = {
    0: [],
    1: [],
    2: [],
    3: [],
    4: ["postType", "itvAplyTtl", "formattedAplyDt", "itvAplcntNm", "viewCnt" ],
    5: []
}

export const SELECT_POST_SN_KEY = {
    0: "",
    1: "",
    2: "",
    3: "",
    4: "itvSn",
    5: ""
}

export const SELECT_DETAIL_API = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: readInterview,
    5: 5
}

export const SELECT_DETAIL_PAGE_PATH = {
    0: 0,
    1: 1,
    2: 2,
    3: 3,
    4: "/stdHome/studySched/interview" //상세보기 뒷부분: :postSn은 navigate로 동적으로 추가
}