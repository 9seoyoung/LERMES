import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
// import { useAccount } from "../hooks/useAccount"; 만들 예정

function HomeIndex() {
  const test = "";
  // const { user, loading } = useAccount();
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (loading) return;          // 아직 세션 확인 중이면 대기
  //   if (!user) {
  //     navigate("/", { replace: true });
  //     return;
  //   }

  //   // 권한 번호 읽기 (snake_case/camelCase 모두 대응)
  //   const authNo = user.userAuthrtNo ?? user.user_authrt_no;

  //   if (authNo === 1 || authNo === 2) {                 // authNo 값 조정 필요(권한레벨)
  //     navigate("/home/main", { replace: true });        // 권한 확인 시 리디렉션 될 페이지
  //   } else if (authNo === 3) {
  //     navigate("/home/cusorderlist", { replace: true }); // 권한 확인 시 리디렉션 될 페이지
  //   } else {
  //     navigate("/403", { replace: true });              // 나머지는 권한 없음
  //   }
  // }, [user, loading, navigate]);

  return null; // 렌더링할 내용 없음, 분기만 처리
}

export default HomeIndex;