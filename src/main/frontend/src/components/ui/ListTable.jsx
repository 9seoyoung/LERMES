import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../../styles/UiComp.module.css';
import { toast } from 'react-toastify';
import { useState } from 'react';

export default function ListTable({
  tableHead = [],
  apiData = [],
  columnData = [],
  gridTemplate,
  gap = 0,
  whereTogo,
  allPage,
  postKey,
  typeKey,
  addStyle = {},
  selectedIdx,
  apiBtn = false,
  approveApi,
  denyApi,
  directPage = false,
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [rowStatus, setRowStatus] = useState({}); // ✅ 승인/거절 상태 저장

  if (!apiData?.length) {
    return <div className={styles.ListTbBg}>-</div>;
  }

  const resolvedTemplate = Array.isArray(gridTemplate)
    ? gridTemplate.join(' ')
    : gridTemplate ||
      `repeat(${tableHead?.length || columnData?.length || 1}, minmax(0,1fr))`;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <ul
        style={{
          ['--cols']: resolvedTemplate,
          ['--gap']: gap,
          boxShadow: '4px 4px 4px #00000025',
          position: 'relative',
          zIndex: '3',
        }}
      >
        {tableHead?.length > 0 ? (
          <li id={styles.ListHeader} className={`${styles.gridRow}`}>
            {tableHead.map((col, idx) => (
              <div key={`th-${idx}`} className={styles.cell}>
                {col}
              </div>
            ))}
          </li>
        ) : null}
      </ul>

      <div style={{ ...addStyle }}>
        <ul
          className={styles.ListTbBg}
          style={{ ['--cols']: resolvedTemplate, ['--gap']: gap }}
        >
          {apiData.map((row, i) => {
            const rowKey =
              row?.[postKey] ??
              `row-${i}-${row?.typeKey || row?.postKey}-${row?.sn}`;

            console.log('row:', row);

            const status =
              rowStatus[rowKey] ||
              (row.cohortMemStts ? row.cohortMemStts.toLowerCase() : null);

            const bgColor =
              status === 'enrolled'
                ? '#d9fdd3' // 초록
                : status === 'denied'
                ? '#ffd6d6' // 빨강
                : 'transparent'; // applied나 approved는 흰색

            return (
              <li
                key={rowKey}
                className={`${styles.row} ${styles.gridRow}`}
                style={{
                  backgroundColor: bgColor,
                  opacity: status ? 0.7 : 1,
                  transition: 'background-color 0.3s ease',
                }}
                onClick={() => {
                  const base =
                    selectedIdx === 0
                      ? `${allPage?.[row[typeKey]]}`
                      : whereTogo;

                  const targetPath = `${base}/${row[postKey]}`;
                  if (location.pathname !== whereTogo) {
                    navigate(targetPath);
                  }
                }}
              >
                <div className={styles.cell}>{i + 1}</div>

                {columnData.map((col, j) => (
                  <div
                    key={`cell-${rowKey}-${j}`}
                    className={styles.cell}
                    style={
                      j === 0 &&
                      (location.pathname === '/stdHome' ||
                        location.pathname === '/tutorHome' ||
                        location.pathname === '/adminHome' ||
                        location.pathname === '/visitorHome' ||
                        location.pathname === '/unknownHome')
                        ? { justifyContent: 'flex-start' }
                        : {}
                    }
                  >
                    {row[col]}
                  </div>
                ))}

                <>
                  {directPage ? (
                    <div
                      className={styles.cell}
                      onClick={() =>
                        navigate('/visitorHome/applyRecruitPoster')
                      }
                    >
                      바로가기
                    </div>
                  ) : null}

                  {apiBtn && status !== 'enrolled' && status !== 'denied' ? (
                    <div className={styles.cell}>
                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await approveApi(row.userSn);
                            toast.success('승인되었습니다.');
                            setRowStatus((prev) => ({
                              ...prev,
                              [rowKey]: 'enrolled',
                            }));
                            row.cohortMemStts = 'ENROLLED';
                          } catch (err) {
                            console.log(err.message);
                            toast.error('승인 중 오류 발생');
                          }
                        }}
                        className={styles.blueBtn}
                        style={{ width: '40px' }}
                      >
                        승인
                      </button>

                      <button
                        type="button"
                        onClick={async () => {
                          try {
                            await denyApi(row.userSn);
                            toast.success('거절되었습니다.');
                            setRowStatus((prev) => ({
                              ...prev,
                              [rowKey]: 'denied',
                            }));
                          } catch (err) {
                            console.log(err.message);
                            toast.error('거절 중 오류 발생');
                          }
                        }}
                        className={styles.redBtn}
                        style={{ width: '40px' }}
                      >
                        거절
                      </button>
                    </div>
                  ) : null}
                </>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
