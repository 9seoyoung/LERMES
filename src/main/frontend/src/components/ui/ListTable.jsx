import { useLocation, useNavigate } from "react-router-dom";
import styles from "../../styles/UiComp.module.css";
import { toast } from "react-toastify";
import { useState } from "react";



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
  directPage = false
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [rowStatus, setRowStatus] = useState({}); 

  if (!apiData?.length) {
    return <div className={styles.ListTbBg}>-</div>;
  }

  const resolvedTemplate = Array.isArray(gridTemplate)
    ? gridTemplate.join(" ")
    : gridTemplate ||
      `repeat(${(tableHead?.length || columnData?.length || 1)}, minmax(0,1fr))`;

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
      <ul
        style={{
          ["--cols"]: resolvedTemplate,
          ["--gap"]: gap,
          boxShadow: "4px 4px 4px #00000025",
          position: "relative",
          zIndex: "3",
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
          style={{ ["--cols"]: resolvedTemplate, ["--gap"]: gap }}
        >
          {apiData.map((row, i) => {
            const rowKey = row?.[postKey] ?? `row-${i}`; // 안정 키 우선

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
                style={ (location.pathname === "/adminHome/accountSet" ? {
                  backgroundColor: bgColor,
                  opacity: status ? 0.7 : 1,
                  transition: 'background-color 0.3s ease',
                } : null )}
                
                onClick={() => {
                  const base = selectedIdx === 0 ? `${allPage[row[typeKey]]}` : whereTogo;
                  
                  const targetPath = `${base}/${row[postKey]}`;
                  console.log(selectedIdx);
                  console.log('현재 경로:', location.pathname);
                  console.log('이동 대상:', targetPath);
                  
                  if (location.pathname !== whereTogo) {
                    navigate(targetPath);
                  }
                }}
              >
                {/* 번호 셀 - 이건 map 안의 첫 자식이라 별도 key 필요 없음 */}
                <div className={styles.cell}>{i + 1}</div>

                {/* 데이터 셀들 - 각 셀에 고유 key */}
                {columnData.map((col, j) => (
                  <div key={`cell-${rowKey}-${j}`} className={styles.cell} style={(j === 0 && (location.pathname === "/stdHome" || location.pathname === "/tutorHome" || location.pathname === "/adminHome" || location.pathname === "/visitorHome" || location.pathname === "/unknownHome")? {justifyContent: "flex-start"}: {})}>
                    {row[col]}
                  </div>
                ))}
                <>
                 {directPage ? 
                  <div className={styles.cell} onClick={() => navigate(`/visitorHome/applyRecruitPoster/${row?.rspnsSn}`)}>
                    바로가기
                  </div>
                 : null}
                 {apiBtn ? 
                  <>
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
                      >승인</button>
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
                  </>
                 : ""}
                </>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}