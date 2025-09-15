import styles from "../../styles/UiComp.module.css";

// @apiData api 호출해서 구조분해할당한 것., 백에서 객체 배열로 보내줘야됨
export default function ListTable({apiData, columnData}) {
    //백에서 넘겨받은 데이터의 길이를 부정해서 0이면(하나라도 담기면 패스) 데이터 없음 리턴
    if(!apiData?.length) {
        return <div className={styles.ListTbBg}>-</div>;
    }
    return (
    <ul className={styles.ListTbBg}>
        {apiData.map((row, i) => (
            <li key={i} className={styles.row}>
                {columnData.map((col, j) => (
                <div key={j} className={styles.cell }>
                {row[col]}
                </div>
                ))}
            </li>
        ))}
    </ul>
    );
}

// 아 api로 받아온 객체배열형태인 데이터 apiData를
/**
 * api로 받아온 객체배열형태인 데이터 apiData를
 * .map메서드로 돌리면서
 * 새로운 값으로 반환할 건데?
 * map메서드의 파라미터가 item, index면
 * index가 끝을 향해 달리는 동안
 * item 하나가 => ul > (li * n) 형태고,
 * li * n에서 n은 데이터 표에 필요한 컬럼 수
 * ul은 항상 display: flex와 flex-direction: column이어야 되고, gap은 맘 껏
 * hover도 ul에 걸면 되네
 * 그럼 결국 복잡도는 N제곱 아닌가?
 * 객체배열 돌려서 객체만 남았는데. n만큼 객체에서 뽑아내야하잖음.
 * 그리고 객체에서 쓰는 키 값도 프롭스로 넘겨받아야겠네. 얘를 배열 프롭스로 받아야겟네
 * 그리고 이 배열 프롭스를 돌리면 <li> {item[배열값]}</li> 하면되니까 결국 필요한
 * 컬럼 수가 동적으로 늘어나게 되는군
 */