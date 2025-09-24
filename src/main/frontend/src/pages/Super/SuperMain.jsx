// 페이지찾기 - 슈퍼메인
import { useEffect, useState } from "react"
import cardStyle from "../../styles/superMain.module.css"
import { pullAllCompany } from "../../services/infoService";
import { toast } from "react-toastify";

export default function SuperMain() {
  const [companyList, setCompanyList] = useState();
  const [fixedSn, setFixedSn] = useState(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await pullAllCompany();
        setCompanyList( data.data );
        console.log(companyList);
        toast.success("정보 불러옴");
      } catch (err) {
        toast.error(err.message);
        console.log("회사불러오기 실패", err);
      }
    };
  
    fetchCompanies();
  }, []);

  // active
  // : 
  // true
  // brno
  // : 
  // "2003004051"
  // fileSn
  // : 
  // null
  // id
  // : 
  // 8
  // name
  // : 
  // "GSITM"
  // registeredAt
  // : 
  // "2025-09-12T09:26:28"


  return (
    <>
    <div className={cardStyle.mainContainer_cardGrid}>
      <div className={cardStyle.company_card}
        style={{
          backgroundImage: `url(${companyList?.imageUrl ?? "#"})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }}
      >
        <div></div>
        <div className={cardStyle.card_bottom}>
          <p className={cardStyle.title} data-title-type="3">회사</p>
          <p className={cardStyle.title}>소재지</p>
          <div className={cardStyle.row} data-box-type="row">
            <button>LMS 바로가기</button>
            <button>상태변수</button>
          </div>
        </div>
      </div>
    </div>
      {companyList?.map((v, idx)=>(
        <>
          {console.log(v)}
          <div 
              key={idx}
              className={cardStyle.company_card}
                style={{
                backgroundImage: `url(${companyList?.imageUrl ?? "#"})`,
                backgroundSize: "cover",
                backgroundPosition: "center"
              }}
            >
              <div></div>
              <div className={cardStyle.card_bottom}>
                <p className={cardStyle.title} data-title-type="3">{v?.name}</p>
                <p className={cardStyle.title}>{v?.coPl}</p>
                <div className={cardStyle.row} data-box-type="row">
                  <button type="button" onClick={() => setFixedSn(v.id)}>LMS 바로가기</button>
                  <button type="button">상태변수</button>
                </div>
              </div>
            </div>
          </>
      ))}
    </>
  )
}
