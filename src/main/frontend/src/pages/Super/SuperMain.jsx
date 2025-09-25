// 페이지찾기 - 슈퍼메인
import { useEffect, useState } from "react"
import cardStyle from "../../styles/superMain.module.css"
import { pullAllCompany } from "../../services/infoService";
import { toast } from "react-toastify";
import { useSelectedCompany } from "../../contexts/SelectedCompanyContext";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../../auth/AuthContext";


export default function SuperMain() {
  const {user} = useAccount();
  const { effectiveSn, setFixedSn, fixedSn } = useSelectedCompany();
  const [companyList, setCompanyList] = useState();
  const navigate = useNavigate();
  const myCoSn = user?.USER_OGDP_CO_SN;
  const myAuth = user?.USER_AUTHRT_SN;
  const authLvPath = {
    1: "adminHome",
    2: "adminHome",
    3: "adminHome",
    4: "tutorHome",
    5: "stdHome",
    6: "visitorHome",
    7: "visitorHome"
  }
  const loc = authLvPath[myAuth];


  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await pullAllCompany();
        setCompanyList( res.data );
        console.log(companyList);
        toast.success("정보 불러옴");
      } catch (err) {
        toast.error(err.message);
        console.log("회사불러오기 실패", err);
      }
    };
  
    fetchCompanies();
  }, []);
  
    
  const handleGoLms = (e) => {
    // myCoSn != fixedSn ? navigate('/visitorHome', {redirect: true}) : <>{navigate(`${authLvPath}`, {redirect: true})}</>}
    if (myCoSn != fixedSn) navigate('/visitorHome', {redirect:true});
    else if (myCoSn == fixedSn || myCoSn == effectiveSn) navigate(`${authLvPath}`, {redirect: true});
    else navigate('/403', {redirect: true});
  }
  
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
                    <button type="button"  onClick={() => {setFixedSn(v.id); handleGoLms(loc); console.log(effectiveSn);}}>LMS 바로가기</button>
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
