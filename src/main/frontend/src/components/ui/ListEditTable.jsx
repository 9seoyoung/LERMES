import { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../styles/UiComp.module.css";
import { DateTimeInput, OrangeCheckbox } from "./UiComp";

export default function ListEditTable({
    tableHead = [],
    nameArr = [],
    apiData = [],
    columnData = [],
    formData,          // 필요하면 유지
    handleChange,
    gridTemplate,
    gap = 0,
    type = [],
}) {
    const [selected, setSelected] = useState(() => new Set());
    const headerCbRef = useRef(null);
    
    const resolvedTemplate = useMemo(() => {
        return Array.isArray(gridTemplate)
        ? gridTemplate.join(" ")
        : gridTemplate ||
        `repeat(${(tableHead?.length || columnData?.length || 1) + 1}, minmax(0,1fr))`;
    }, [gridTemplate, tableHead, columnData]);
    
    const getRowId = (row, i) => row.id ?? row.sn ?? row.MAT_SN ?? row.USER_SN ?? i;
    const allIds = useMemo(() => apiData.map(getRowId), [apiData]);
    const allSelected = selected.size > 0 && selected.size === allIds.length;
    const someSelected = selected.size > 0 && selected.size < allIds.length;
    
    useEffect(() => {
        if (headerCbRef.current) headerCbRef.current.indeterminate = someSelected;
    }, [someSelected]);
    
    const toggleAll = () => {
        setSelected(prev => (prev.size === allIds.length ? new Set() : new Set(allIds)));
    };
    
    const toggleRow = (id) => {
        setSelected(prev => {
            const s = new Set(prev);
            s.has(id) ? s.delete(id) : s.add(id);
            return s;
        });
    };
    

    
    return (
        <>
      {/* 툴바 */}
      <ul style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
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
            onClick={handleBulkDelete}
            disabled={selected.size === 0}
            style={{ opacity: selected.size === 0 ? 0.5 : 1 }}
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
          <li key="tableHead" className={`${styles.ListHeader} ${styles.gridRow}`}>
            {/* 체크박스 헤더 빈 칸 */}
            <div className={styles.cell} />
            {tableHead.map((col, idx) => (
              <div key={`th-${idx}`} className={styles.cell}>
                {col}
              </div>
            ))}
          </li>
        )}

        {apiData.map((row, i) => {
          const id = getRowId(row, i);
          const checked = selected.has(id);

          return (
            <li key={id} className={`${styles.editRow} ${styles.gridRow}`}>
              {/* 체크박스 컬럼 */}
              <div className={styles.cell}>
                <OrangeCheckbox
                  checked={checked}
                  onChange={() => toggleRow(id)}
                  value={id}
                />
              </div>

              {/* 데이터 컬럼 */}
              {columnData.map((col, j) => (
                <div key={`${id}-${j}`} className={styles.cell}>
                  {type[j] === "date" || type[j] === "time" ? (
                    <DateTimeInput
                      type={type[j]}
                      handleChange={handleChange}
                      name={nameArr[j]}
                      formData={row}          // 각 행 기준으로 넘김
                    />
                  ) : (
                    // 편집 불가면 div로 보여주고, 편집 가능이면 value/onChange로 제어
                    <input
                      type={type[j] || "text"}
                      value={row[col] ?? ""}
                      onChange={(e) => handleChange?.(e, { row, rowIndex: i, col, colIndex: j })}
                      autoComplete="off"
                    />
                  )}
                </div>
              ))}
            </li>
          );
        })}
      </ul>
    </>
  );
}