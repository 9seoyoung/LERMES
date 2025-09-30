// import { useEffect, useMemo, useRef, useState } from "react";
// import styles from "../../styles/UiComp.module.css";
// import { DateTimeInput, OrangeCheckbox } from "./UiComp";

// export default function ListEditTable({
//     tableHead = [],
//     nameArr = [],
//     apiData = [],
//     columnData = [],
//     formData,          // 필요하면 유지
//     handleChange,
//     gridTemplate,
//     gap = 0,
//     type = [],
// }) {
//     const [selected, setSelected] = useState(() => new Set());
//     const headerCbRef = useRef(null);
    
//     const resolvedTemplate = useMemo(() => {
//         return Array.isArray(gridTemplate)
//         ? gridTemplate.join(" ")
//         : gridTemplate ||
//         `repeat(${(tableHead?.length || columnData?.length || 1) + 1}, minmax(0,1fr))`;
//     }, [gridTemplate, tableHead, columnData]);
    
//     const getRowId = (row, i) => row.id ?? row.sn ?? row.MAT_SN ?? row.USER_SN ?? i;
//     const allIds = useMemo(() => apiData.map(getRowId), [apiData]);
//     const allSelected = selected.size > 0 && selected.size === allIds.length;
//     const someSelected = selected.size > 0 && selected.size < allIds.length;
    
//     useEffect(() => {
//         if (headerCbRef.current) headerCbRef.current.indeterminate = someSelected;
//     }, [someSelected]);
    
//     const toggleAll = () => {
//         setSelected(prev => (prev.size === allIds.length ? new Set() : new Set(allIds)));
//     };
    
//     const toggleRow = (id) => {
//         setSelected(prev => {
//             const s = new Set(prev);
//             s.has(id) ? s.delete(id) : s.add(id);
//             return s;
//         });
//     };
    

    
//     return (
//         <>
//       {/* 툴바 */}
//       <ul style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
//         <li>
//           <label style={{ display: "inline-flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
//             <input
//               ref={headerCbRef}
//               type="checkbox"
//               checked={allSelected}
//               onChange={toggleAll}
//             />
//             전체선택
//           </label>
//         </li>
//         <li>
//           <button
//             // onClick={handleBulkDelete}
//             disabled={selected.size === 0}
//             style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
//           >
//             선택삭제 ({selected.size})
//           </button>
//         </li>
//       </ul>

//       {/* 테이블 */}
//       <ul
//         className={styles.ListTbBg}
//         style={{ ["--cols"]: resolvedTemplate, ["--gap"]: gap }}
//       >
//         {tableHead?.length > 0 && (
//           <li key="tableHead" className={`${styles.ListHeader} ${styles.gridRow}`}>
//             {/* 체크박스 헤더 빈 칸 */}
//             <div className={styles.cell} />
//             {tableHead.map((col, idx) => (
//               <div key={`th-${idx}`} className={styles.cell}>
//                 {col}
//               </div>
//             ))}
//           </li>
//         )}

//         {apiData.map((row, i) => {
//           const id = getRowId(row, i);
//           const checked = selected.has(id);

//           return (
//             <li key={id} className={`${styles.editRow} ${styles.gridRow}`}>
//               {/* 체크박스 컬럼 */}
//               <div className={styles.cell}>
//                 <OrangeCheckbox
//                   checked={checked}
//                   onChange={() => toggleRow(id)}
//                   value={id}
//                 />
//               </div>

//               {/* 데이터 컬럼 */}
//               {columnData.map((col, j) => (
//                 <div key={`${id}-${j}`} className={styles.cell}>
//                   {type[j] === "date" || type[j] === "time" ? (
//                     <DateTimeInput
//                       type={type[j]}
//                       handleChange={handleChange}
//                       name={nameArr[j]}
//                       formData={row}          // 각 행 기준으로 넘김
//                     />
//                   ) : (
//                     // 편집 불가면 div로 보여주고, 편집 가능이면 value/onChange로 제어
//                     <input
//                       type={type[j] || "text"}
//                       value={row[col] ?? ""}
//                       onChange={(e) => handleChange?.(e, { row, rowIndex: i, col, colIndex: j })}
//                       autoComplete="off"
//                     />
//                   )}
//                 </div>
//               ))}
//             </li>
//           );
//         })}
//       </ul>
//     </>
//   );
// }


import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../styles/UiComp.module.css";
import { DateTimeInput, OrangeCheckbox } from "./UiComp";

export default function ListEditTable({
  tableHead = [],
  nameArr = [],
  apiData = [],
  columnData = [],
  formData,
  handleChange,        // 외부 제어용(옵션)
  onRowsChange,        // 상위로 행 변경 알림(옵션) — 플레이스홀더 제외
  gridTemplate,
  gap = 0,
  type = [],
  
}) {
  // ---------- 유틸 ----------
  const makeEmptyRow = () => {
    const base = {};
    columnData.forEach((c) => (base[c] = ""));
    return {
      __tmpId: `tmp_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      __placeholder: true,
      ...base,
    };
  };
  const ensureTrailingPlaceholder = (list) => {
    if (!list.length || !list[list.length - 1]?.__placeholder) {
      return [...list, makeEmptyRow()];
    }
    return list;
  };
  const stripPlaceholder = (list) => list.filter((r) => !r.__placeholder);

  const getRowId = (row, i) =>
    row.id ?? row.sn ?? row.MAT_SN ?? row.USER_SN ?? row.__tmpId ?? i;

  const hasAnyValue = (row) =>
    columnData.some((c) => {
      const v = row[c];
      return v !== undefined && v !== null && String(v).trim() !== "";
    });

  // ---------- 행 상태 ----------
  const [rows, setRows] = useState(() => ensureTrailingPlaceholder(apiData ?? []));
  useEffect(() => {
    setRows(ensureTrailingPlaceholder(apiData ?? []));
  }, [apiData]);

  const emitRows = (next) => {
    setRows(next);
    onRowsChange?.(stripPlaceholder(next));
  };

  // ---------- 선택 상태 (플레이스홀더 제외) ----------
  const [selected, setSelected] = useState(() => new Set());
  const headerCbRef = useRef(null);

  const selectableRows = useMemo(() => rows.filter((r) => !r.__placeholder), [rows]);
  const allIds = useMemo(() => selectableRows.map(getRowId), [selectableRows]);
  const allSelected = selected.size > 0 && selected.size === allIds.length;
  const someSelected = selected.size > 0 && selected.size < allIds.length;

  useEffect(() => {
    if (headerCbRef.current) headerCbRef.current.indeterminate = someSelected;
  }, [someSelected]);

  const toggleAll = () => {
    setSelected((prev) =>
      prev.size === allIds.length ? new Set() : new Set(allIds)
    );
  };
  const toggleRow = (id) => {
    setSelected((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  const handleBulkDelete = () => {
    if (selected.size === 0) return;
    const next = rows.filter((r, i) => {
      if (r.__placeholder) return true; // 플레이스홀더 보존
      const id = getRowId(r, i);
      return !selected.has(id);
    });
    emitRows(ensureTrailingPlaceholder(next));
    setSelected(new Set());
  };

  // ---------- 포커스 관리 ----------
  // 각 input을 (rowKey:colIndex)로 식별하여 ref 저장
  const refMap = useRef(new Map()); // key: `${rowKey}:${colIndex}` -> HTMLInputElement
  const setInputRef = (rowKey, colIndex) => (el) => {
    const k = `${rowKey}:${colIndex}`;
    if (el) refMap.current.set(k, el);
    else refMap.current.delete(k);
  };

  const [pendingFocusKey, setPendingFocusKey] = useState(null);
  useEffect(() => {
    if (pendingFocusKey) {
      const el = refMap.current.get(pendingFocusKey);
      if (el) {
        el.focus();
        setPendingFocusKey(null);
      }
    }
  }, [rows, pendingFocusKey]);

  // ---------- 셀 변경 ----------
  const internalChange = (e, { rowIndex, col, colIndex }) => {
    const value = e?.target?.value ?? e; // DateTimeInput이 값만 줄 수도 있음
    const next = rows.map((r, i) => (i === rowIndex ? { ...r, [col]: value } : r));

    const curr = next[rowIndex];
    // 플레이스홀더에 입력이 생기면 → 일반행으로 전환 + 새 플레이스홀더 보장
    if (curr.__placeholder && hasAnyValue(curr)) {
      delete curr.__placeholder;
      emitRows(ensureTrailingPlaceholder(next));
    } else {
      emitRows(next);
    }
  };

  const onCellChange = (e, meta) => {
    if (handleChange) return handleChange(e, meta);
    internalChange(e, meta);
  };

  // 마지막 셀에서 Tab → 새 플레이스홀더 만들고 첫 칸 포커스
  const handleTabAtLastCell = (e, { rowIndex }) => {
    const isLastCol = columnData.length > 0 ? true : false;
    if (!isLastCol) return;

    const isLastRow = rowIndex === rows.length - 1;
    if (isLastRow) {
      e.preventDefault();

      // 현재 마지막이 플레이스홀더가 아니라면 추가
      let next = rows.slice();
      if (!next[next.length - 1].__placeholder) {
        next = ensureTrailingPlaceholder(next);
      } else {
        // 이미 플레이스홀더가 있고, 그 플레이스홀더에 포커스를 주려고 하는 상황
        // → 그대로 첫 칸에 포커스만 주면 됨
      }
      emitRows(next);

      const newRow = next[next.length - 1];
      const newKey = getRowId(newRow, next.length - 1);
      setPendingFocusKey(`${newKey}:0`); // 새 줄의 첫 번째 칸에 포커스
    }
  };

  // ---------- 레이아웃 ----------
  const resolvedTemplate = useMemo(() => {
    return Array.isArray(gridTemplate)
      ? gridTemplate.join(" ")
      : gridTemplate ||
          `repeat(${(tableHead?.length || columnData?.length || 1) + 1}, minmax(0,1fr))`;
  }, [gridTemplate, tableHead, columnData]);

  return (
    <>
      {/* 툴바 */}
      <ul style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 , justifyContent: "space-between"}}>
        <li>
          <label style={{ display: "inline-flex", gap: 6, alignItems: "center", cursor: "pointer" }}>
            <input
              ref={headerCbRef}
              type="checkbox"
              checked={allSelected}
              onChange={toggleAll}
            />
            전체선택
          </label>
        </li>
        <li>
          <button
            id="accountD_Btn"
            onClick={handleBulkDelete}
            disabled={selected.size === 0}
            style={{ opacity: selected.size === 0 ? 0.5 : 1 , color: selected.size  === 0 ? null : "#E9623A"}}
          >
            선택삭제 ({selected.size})
          </button>
        </li>
      </ul>

      {/* 테이블 */}
      <ul
        className={styles.ListTbBg}
        style={{ ["--cols"]: resolvedTemplate, ["--gap"]: gap }}
      >
        {tableHead?.length > 0 && (
          <li key="tableHead" id={`${styles.ListHeader}`} className={` ${styles.gridRow}`}>
            <div className={styles.cell} />
            {tableHead.map((col, idx) => (
              <div key={`th-${idx}`} className={styles.cell}>
                {col}
              </div>
            ))}
          </li>
        )}

        {rows.map((row, i) => {
          const rowKey = getRowId(row, i);
          const isPh = !!row.__placeholder;
          const checked = !isPh && selected.has(rowKey);

          return (
            <li key={rowKey} className={`${styles.row} ${styles.gridRow}`}>
              {/* 체크박스: 플레이스홀더면 표시X */}
              <div className={styles.cell}>
                {isPh ? (
                  <span style={{ opacity: 0.4 }}>—</span>
                ) : (
                  <input type="checkbox"
                    checked={checked}
                    onChange={() => toggleRow(rowKey)}
                    value={rowKey}
    
                  />
                )}
              </div>
               <div key={`no${i}`} className={styles.cell}>{i + 1}</div>

              {/* 데이터 컬럼 */}
              {columnData.map((col, j) => {
                const commonHandlers = {
                  onChange: (e) =>
                    onCellChange(e, { row, rowIndex: i, col, colIndex: j }),
                  onKeyDown: (e) => {
                    // 마지막 셀에서 Tab (Shift 없이)
                    if (
                      e.key === "Tab" &&
                      !e.shiftKey &&
                      j === columnData.length - 1
                    ) {
                      handleTabAtLastCell(e, { rowIndex: i });
                    }
                  },
                };

                // Date/Time 컴포넌트가 onKeyDown을 전달하지 않는다면,
                // 아래처럼 wrapper div에 onKeyDown을 걸어도 됨(캡처링으로 동작).
                return (
                  <div
                    key={`${rowKey}-${j}`}
                    className={styles.cell}
                    onKeyDown={commonHandlers.onKeyDown}

                  >
                    {type[j] === "date" || type[j] === "time" ? (
                      <input
                    
                        type={type[j]}
                        handleChange={(e, m) =>
                          onCellChange(e, { ...m, rowIndex: i, col, colIndex: j })
                        }
                        name={nameArr[j]}
                        formData={row}
                        // DateTimeInput 내부 input에 포커스를 주려면 prop을 내려서 ref를 연결 가능해야 함.
                        // 라이브 컴포넌트라면 아래 라인을 DateTimeInput이 지원하는 prop 이름에 맞게 조정:
                        // inputRef={j === 0 ? setInputRef(rowKey, 0) : undefined}
                      />
                    ) : (
                      <input
                        ref={setInputRef(rowKey, j)}
                        type={type[j] || "text"}
                        value={row[col] ?? ""}
                        autoComplete="off"
                        {...commonHandlers}
                        style={{
                          width: "100%",
                          padding: "0 12px",
                          margin: "0 12px"
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </li>
          );
        })}
      </ul>
    </>
  );
}