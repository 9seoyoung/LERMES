import styles from "../../styles/UiComp.module.css";
import { DateTimeInput } from "./UiComp";

// @apiData api 호출해서 구조분해할당한 것., 백에서 객체 배열로 보내줘야됨
export default function ListEditTable({
    // props -------------------------------------------------------------
    tableHead = [],
    nameArr = [], // api로 받은 객체의 프로퍼티 이름, 컬럼 순으로
    apiData = [],
    columnData = [],
    formData,
    handleChange,
    gridTemplate,
    gap = 0,
    type = [] // input type 컬럼 순서대로 적으셈
}) {
    // 선언부-------------------------------------------------------------
    //백에서 넘겨받은 데이터의 길이를 부정해서 0이면(하나라도 담기면 패스) 데이터 없음 리턴
    if(!apiData?.length) {
        return <div className={styles.ListTbBg}>-</div>;
    }

    // 1) 배열이면 공백으로 join
    // 2) 문자열이면 그대로
    // 3) 없으면 컬럼 수 기준으로 동일 폭
    const resolvedTemplate = Array.isArray(gridTemplate)
    ? gridTemplate.join(' ')
    : gridTemplate ||
    `repeat(${(tableHead?.length || columnData?.length || 1)}, minmax(0,1fr))`;

    return (
    <ul className={styles.ListTbBg}
        style={{ ['--cols']: resolvedTemplate, ['--gap']: gap }}
    >
        {tableHead?.length > 0 ? 
                <li key="tableHead" className={`${styles.ListHeader} ${styles.gridRow}`}>
        {            tableHead.map((col, idx) => (
                    <div key={`th-${idx}`} className={styles.cell}>{col}</div>
                ))
            }
                </li>
            :
            null
        }
        {apiData.map((row, i) => (
            <li key={i} className={`${styles.editRow} ${styles.gridRow}`}>
                {columnData.map((col, j) => (
                    <>
                        {type[j] === "date" || type[j] === "time" ? 
                        <DateTimeInput
                            type="date" 
                            handleChange={handleChange}
                            name={nameArr[j]}
                            formData={formData} 
                        ></DateTimeInput>
                        :
                        <input 
                            type={type[j]} 
                            key={j} 
                            className={styles.cell} 
                            placeholder={row[col]}
                            autoComplete="false"
                        />
                        }
                    </>
                ))}
            </li>
        ))}
    </ul>
    );
}