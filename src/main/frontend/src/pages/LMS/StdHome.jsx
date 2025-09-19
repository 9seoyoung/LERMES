import NoticeList from '../../components/module/NoticeList';

// 페이지찾기 - 수강생 메인
export default function StdHome() {
  return (
    <div className="mainCont_Lms_Row">
      <div className="main_L" style={{ width: '40%' }}>
        <div style={{ height: '280px' }}>캘린더 컴포넌트로 대체</div>
        <div style={{ height: '422px' }}>일정목록으로 대체</div>
      </div>
      <div className="main_R" style={{ flex: '1', gap: '16px' }}>
        <div style={{ height: '232px' }}>
          <NoticeList></NoticeList>
        </div>
        <div style={{ height: '232px' }}>
          <h4>
            자료실<div className="specificBtn">+ 더보기</div>
          </h4>
        </div>
        <div style={{ height: '232px' }}>
          <h4>
            FAQ<div className="specificBtn">+ 더보기</div>
          </h4>
        </div>
      </div>
    </div>
  );
}
