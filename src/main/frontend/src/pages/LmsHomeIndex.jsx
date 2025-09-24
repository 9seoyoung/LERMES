import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAccount } from "../auth/AuthContext";
import { useSelectedCompany } from "../contexts/SelectedCompanyContext";

function LmsHomeIndex() {
  const { user, loading } = useAccount();
  const {selectedCompany} = useSelectedCompany();
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;          // 아직 세션 확인 중이면 대기
    if (!user) {
      navigate("/visitorHome", { replace: true });
      return;
    }
    
    const myCompany = user.OGDP_CO_SN ?? user.user_ogdp_co_sn ?? user.userOgdpCoSn ; // 내 소속회사

    if(myCompany === selectedCompany) {

      // 권한 번호 읽기 (snake_case/camelCase/Pascal? 모두 대응)
      const userAuthrtSn = user.userAuthrtSn ?? user.user_authrt_sn ?? user.USER_AUTHRT_SN; // 내 권한 번호와 같은지
      const userActvtnYn = user.userActvtnYn ?? user.user_actvtn_yn ?? user.USER_ACTVTN_YN; //활성화 되어있는지
      

      if (userAuthrtSn === 1 && userActvtnYn === 1) { //슈퍼관리자
        navigate("/visitorHome", { replace: true });       
      } else if (userAuthrtSn === 2 && userActvtnYn === 1 || userAuthrtSn === 3 && userActvtnYn === 1) { //테넌트, 직원
        navigate("/adminHome", { replace: true });
      } else if (userAuthrtSn === 4 && userActvtnYn === 1 ){ //강사
        navigate("/tutorHome", { replace: true });              
      } else if (userAuthrtSn === 5 && userActvtnYn === 1 ){ //수강생
        navigate("/stdHome", { replace: true });              
      } else if (userAuthrtSn === 6 && userActvtnYn === 1 ){ //일반회원

      } else {
        navigate("/403", { replace: true });              
      }

    } else {
      navigate("/visitorHome", {replace: true});
    }

    }, [user, loading, navigate]);

  return null; // 렌더링할 내용 없음, 분기만 처리
}

export default LmsHomeIndex;