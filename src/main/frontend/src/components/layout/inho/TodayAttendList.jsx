// TodayAttendList.jsx
import { useEffect, useState } from 'react';
import { fetchTodayAttendance } from '../../../attend/attendService';
import '../../../styles/Attend.css';

const STATUS_KO = {
  PRESENT: '출석',
  LATE: '지각',
  EARLY_LEAVE: '조퇴',
  ABSENT: '결석',
  PRESENT_PENDING: '출석(예정)',
  LATE_PENDING: '지각(예정)',
};

export default function TodayAttendList() {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    fetchTodayAttendance().then((data) => setRows(data || []));
  }, []);

  return (
    <div>
      <h4>
        출결현황 <div className="specificBtn">+ 더보기</div>
      </h4>

      {rows.length === 0 ? (
        <div style={{ padding: 8, color: '#777' }}>오늘 데이터가 없습니다.</div>
      ) : (
        <table className="listTable" style={{ width: '100%' }}>
          <thead>
            <tr>
              <th>순번</th>
              <th>이름</th>
              <th>입실</th>
              <th>퇴실</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((s, idx) => (
              <tr key={s.userSn} className="table-body">
                <td>{idx + 1}</td> {/* 순번 */}
                <td>{s.username}</td>
                <td>{s.checkInTime ?? '-'}</td>
                <td>{s.checkOutTime ?? '-'}</td>
                <td>
                  <span className={`badge badge--${s.status ?? 'ABSENT'}`}>
                    {STATUS_KO[s.status ?? 'ABSENT']}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
