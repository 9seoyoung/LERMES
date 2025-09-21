// // 페이지찾기 - 강사 메인
// export default function TutorHome() {
//   return (
//     <>
//       <div>강사 4</div>
//     </>
//   );
// }

import NoticeList from '../../components/module/NoticeList';
import TodayAttendList from '../../components/module/TodayAttendList';

export default function StdHome() {
  return (
    <div className="mainCont_Lms_Row">
      <div className="main_L" style={{ width: '40%' }}>
        <div  className='dashBoardModule' style={{ height: '280px' }}>캘린더 컴포넌트로 대체</div>
        <div  className='dashBoardModule'style={{ height: '422px' }}>일정목록으로 대체</div>
      </div>
      <div className="main_R" style={{ flex: '1', gap: '16px' }}>
        <div  className='dashBoardModule'style={{ height: '232px' }}>
          <NoticeList></NoticeList>
        </div>
        <div className='dashBoardModule' style={{ height: '470px' }}>
          <TodayAttendList></TodayAttendList>
        </div>
      </div>
    </div>
  );
}
