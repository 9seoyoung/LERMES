// 페이지찾기 - 슈퍼메인
import { useEffect, useState } from "react"
import cardStyle from "../../styles/superMain.module.css"
import { pullAllCompany } from "../../services/infoService";
import { toast } from "react-toastify";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import { useNavigate } from "react-router-dom";


export default function SuperMain() {
  const { effectiveSn, setFixedSn } = useSelectedCompany();
  const [companyList, setCompanyList] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const { data } = await pullAllCompany();
        setCompanyList( data );
        console.log(companyList);
        toast.success("정보 불러옴");
      } catch (err) {
        toast.error(err.message);
        console.log("회사불러오기 실패", err);
      }
    };
  
    fetchCompanies();
  }, []);
  
  
  return (
    <div className={cardStyle.mainContainer_cardGrid}>
        {companyList?.map((v, idx)=>(
          <>
            <div 
                key={idx}
                className={cardStyle.company_card}
                style={{
                  backgroundImage: `url(${v?.imageUrl ?? "#"})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
                >
                <div></div>
                <div className={cardStyle.card_bottom}>
                  <p className={cardStyle.title} data-title-type="3">{v?.name}</p>
                  <p className={cardStyle.title}>{`소재지 ${v?.coPl}`}</p>
                  <div className={cardStyle.row} data-box-type="row">
                    <button type="button"  onClick={() => {setFixedSn(v.id); navigate('/lmsHomeIndex'); console.log(effectiveSn);}}>LMS 바로가기</button>
                    <button type="button">상태변수</button>
                  </div>
                </div>
              </div>
          </>
      ))}
    </div>
  )
}

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
