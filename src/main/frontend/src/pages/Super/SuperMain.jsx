// 페이지찾기 - 슈퍼메인
// import { useEffect, useState } from 'react';
// import cardStyle from '../../styles/superMain.module.css';
// import { pullAllCompany } from '../../services/infoService';
// import { toast } from 'react-toastify';
// import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
// import { useNavigate } from 'react-router-dom';
// import { useAccount } from '../../auth/AuthContext';

// export default function SuperMain() {
//   const { user } = useAccount();
//   const { effectiveSn, setFixedSn, fixedSn } = useSelectedCompany();
//   const [companyList, setCompanyList] = useState();
//   const [flipped, setFlipped] = useState(null); 
//   const navigate = useNavigate();
//   const myCoSn = user?.USER_OGDP_CO_SN;
//   const myAuth = user?.USER_AUTHRT_SN;
//   const authLvPath = {
//     1: 'adminHome',
//     2: 'adminHome',
//     3: 'adminHome',
//     4: 'tutorHome',
//     5: 'stdHome',
//     6: 'visitorHome',
//     7: 'visitorHome',
//   };
//   const loc = authLvPath[myAuth];

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const res = await pullAllCompany();
//         console.log(res.data);
//         console.log(res);
//         setCompanyList(res.data);
//         // 상준아 상태값 내놔.
//         toast.success('정보 불러옴');
//       } catch (err) {
//         toast.error(err.message);
//         console.log('회사불러오기 실패', err);
//       }
//     };

//     fetchCompanies();
//   }, [effectiveSn]);

//   const handleGoLms = (selectedCoSn) => {
//     // 상태는 비동기이므로 분기엔 클릭값을 직접 사용
//     if (myCoSn !== selectedCoSn) {
//       navigate('/visitorHome', { replace: true });
//     } else {
//       const path = authLvPath[myAuth] ?? 'visitorHome';
//       navigate(`/${path}`, { replace: true });
//     }
//   };

//   return (
//     <div className={cardStyle.mainContainer_cardGrid}>
//       {companyList?.map((v, idx) => (
//         <>
//           <div
//             key={idx}
//             className={`${cardStyle.company_card} ${cardStyle.flipCard}`}
//             style={{
//               backgroundImage: v?.bigLogoFileSn
//                 ? `url(http://localhost:940/api/files/id/${v.bigLogoFileSn})`
//                 : 'none',
//               backgroundSize: 'contain',
//               backgroundPosition: 'center',
//               backgroundRepeat: 'no-repeat',
//             }}
//           >
//             <div></div>
//             <div className={cardStyle.card_bottom}>
//               <p className={cardStyle.title} data-title-type="3">
//                 {v?.name}
//               </p>
//               <p className={cardStyle.title}>{`소재지 ${v?.coPl}`}</p>
//               <div className={cardStyle.row} data-box-type="row">
//                 <button
//                   type="button"
//                   onClick={() => {
//                     setFixedSn(v.id);
//                     handleGoLms(v.id);
//                   }}
//                 >
//                   LMS 바로가기
//                 </button>
//                 <button type="button">{`${v.stts}`}</button>
//               </div>
//             </div>
//           </div>
//         </>
//       ))}
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import cardStyle from '../../styles/superMain.module.css';
import { pullAllCompany } from '../../services/infoService';
import { toast } from 'react-toastify';
import { useSelectedCompany } from '../../contexts/SelectedCompanyContext';
import { useNavigate } from 'react-router-dom';
import { useAccount } from '../../auth/AuthContext';
import CardBack from '../../components/ui/CardBack';

export default function SuperMain() {
  const { user } = useAccount();
  const { effectiveSn, setFixedSn } = useSelectedCompany();
  const [companyList, setCompanyList] = useState([]);
  const [flipped, setFlipped] = useState(null); // 클릭 토글용
  const navigate = useNavigate();
  const myCoSn = user?.USER_OGDP_CO_SN;
  const myAuth = user?.USER_AUTHRT_SN;
  const authLvPath = { 1:'adminHome', 2:'adminHome', 3:'adminHome', 4:'tutorHome', 5:'stdHome', 6:'visitorHome', 7:'visitorHome' };

  useEffect(() => {
    (async () => {
      try {
        const res = await pullAllCompany();
        setCompanyList(res.data ?? []);
      } catch (err) {
        toast.error(err.message);
        console.log('회사불러오기 실패', err);
      }
    })();
  }, [effectiveSn]);

  const handleGoLms = (selectedCoSn) => {
    if (myCoSn !== selectedCoSn) {
      navigate('/visitorHome', { replace: true });
    } else {
      const path = authLvPath[myAuth] ?? 'visitorHome';
      navigate(`/${path}`, { replace: true });
    }
  };

  return (
    <div className={cardStyle.mainContainer_cardGrid}>
      {companyList?.map((v, idx) => {
        const bg = v?.bigLogoFileSn
          ? `url(http://localhost:940/api/files/id/${v.bigLogoFileSn})`
          : 'none';

        const isFlipped = flipped === v.id;

        return (
          <div
          key={v.id ?? idx}
          className={cardStyle.flipCard}
          onClick={() => {setFlipped(flipped === v.id ? null : v.id); setFixedSn(v.id)}}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setFlipped(flipped === v.id ? null : v.id);
            }
          }}
          aria-pressed={flipped === v.id}
        >
          <div className={`${cardStyle.flipInner} ${flipped === v.id ? cardStyle.isFlipped : ''}`}>
            {/* 앞면: 기존 .company_card 그대로 */}
            <div
              className={cardStyle.company_card}
              style={{
                backgroundImage: v?.bigLogoFileSn
                  ? `url(http://localhost:940/api/files/id/${v.bigLogoFileSn})`
                  : 'none',
                backgroundSize: 'contain',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
              }}
            >
              <div></div>
              <div className={cardStyle.card_bottom}>
                <p className={cardStyle.title} data-title-type="3">{v?.name}</p>
                <p className={cardStyle.title}>{`소재지 ${v?.coPl}`}</p>
                <div className={cardStyle.row} data-box-type="row">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation(); // 카드 뒤집힘 방지
                      setFixedSn(v.id);
                      handleGoLms(v.id);
                    }}
                  >
                    LMS 바로가기
                  </button>
                  <button type="button" onClick={(e) => e.stopPropagation()}>
                    {`${v.stts}`}
                  </button>
                </div>
              </div>
            </div>
        
            {/* 뒷면: 동일 크기, 다른 내용 */}
            <div className={`${cardStyle.company_card} ${cardStyle.card_back}`}>
              <CardBack effectiveSn={effectiveSn}></CardBack>
            </div>
          </div>
        </div>
        );
      })}
    </div>
  );
}