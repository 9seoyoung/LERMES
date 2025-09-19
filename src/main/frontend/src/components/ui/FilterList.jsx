import React, { useState } from 'react'

function FilterList() {
  const [selectedIdx, setSelected] = useState(0)

  // 전체에 스타일 기본,
  // 다른거 클릭하면 원래 파란색이었던건 바뀌어야함

  const BoardManageFilters = ["전체", "공지", "일정", "자료실", "설문", "FAQ", "문의","학습 일지", "면담 요청", "면담 기록", "임시 저장"];
  // const BoardFilters = ["전체", "공지", "자료실", "설문", "FAQ", "문의", "임시 저장"];
  // const StdPlanFilters = ["전체", "공식", "내 일정", "일지", "자료실"];
  // const StdManageFilters = ["전체", "면담 신청", "면담 요청", "면담 기록", "임시 저장"];
  // const AccountManageFilters = ["직원", "강사", "수강생"];
  // const docxManagneFilters = ["로그 기록", "수료증", "출결확인서"];

  return (
      <ul className="ftList_L">
        { BoardManageFilters.map((ft, idx) => (
          <li
            key={idx}
            onClick={() => setSelected(idx)}
            id= {selectedIdx === idx ? "ftClicked" : ""}
            >{ft}
            </li>
        ))
      }
      {/* 추가 버튼 생성 및 눌렀을 때 배열에 데이터 추가하기 위한 버튼 */}
      </ul>
  )
}

export default FilterList;