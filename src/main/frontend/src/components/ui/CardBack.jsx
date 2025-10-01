
import { useNavigate } from "react-router-dom";
import { hortlistByCpSn } from "../../services/cohortService";
import styles from "../../styles/cardBack.module.css";
import { useState } from "react";

function CardBack({effectiveSn}) {
  const [hortlist, setHortList] = useState([]);
  const navigate = useNavigate();
    console.log("모집공고 불러오기")


  useEffect(() => {
      (async () => {
        try {
          // console.log(coSn);
          // console.log(`>>>>>>>>>>>>>>>hortlistByCpSn(회사별 모집공고 리스트) 호출`)
          const data = await hortlistByCpSn(effectiveSn);
          // console.log(`<<<<<<<<<<<<<<< 반환 ${data.data}`)
          setHortList(data.data || []);
          // console.log(data.data.map((value, idx)=> `${value.cohortNm} + ${idx}`))
        } catch (e) {
          console.log(e.message);
        }
      })();
    }, [coSn]);

  return (
    <div className={styles.cardContainer}>
      <h4>교육 목록</h4>
      <ul>
        {hortlist.map((v, idx) => {
          <li key={`hort-${idx}`} className={styles.liContainer}>
            {v[cohorts].map((item, i) => {
              <>
              <div key={`item-${i}`}>{`${v.stts}`}</div>
              <div>{`${item.crclmNm}`}</div>
              <div>
                <button type="button" onClick={() => navigate(applyRecruitPoster)}>
                  신청
                </button>
              </div>
              </>
            })}

          </li>
        })}
      </ul>
    </div>
  )
}

export default CardBack