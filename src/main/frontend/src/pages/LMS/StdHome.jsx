// import { useState } from 'react';

import NoticeList from '../../components/module/NoticeList';
import CalSched from '../../components/ui/CalSched';

// 페이지찾기 - 수강생 메인
export default function StdHome() {
    // const [selectedDate, setSelectedDate] = useState(null); // 공유할 상태
  
  return (
    <div className="mainCont_Lms_Row" style={{height:"702px"}}>
      <div className="main_L" style={{ width: '40%', height: "100%" }}>
        <div className='dashBoardModule' style={{ height: '100%' }}>

          <CalSched></CalSched>
          </div>
      </div>
      <div className="main_R" style={{ flex: '1', gap: '16px' }}>
        <div className='max_height'>
          <div className='dashBoardModule' style={{ height: '232px' }}>
            <NoticeList></NoticeList>
          </div>
          <div className='dashBoardModule' style={{ height: '232px' }}>
            <h4>
              자료실<div className="specificBtn">+ 더보기</div>
            </h4>
          </div>
          <div className='dashBoardModule' style={{ height: '232px' }}>
            <h4>
              FAQ<div className="specificBtn">+ 더보기</div>
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
}