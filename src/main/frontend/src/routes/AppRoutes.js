import { Routes, Route } from 'react-router-dom';

// 권한
// import RoleRoute from '../auth/RoleRoute'; 역할데이터 권한분기파일 생성후 주석 제거 예정

//페이지
// import HomeIndex from '../auth/HomeIndex'; useAccount 등 세션 생기면 추후 주석 풀 예정
import Login from '../auth/loginPage/Login';
import Layout from '../components/layout/Layout'; //제일 먼저 만들어야 할 파일
import NotAllowed from '../auth/NotAllowed';
import SampleApp from '../sample/SampleApp';

function AppRoutes() {
  return (
  <Routes>
    {/* 매니저님이 짜주신 샘플 코드 */}
    <Route path="/sample" element={<SampleApp />} />

    {/* 여기서 부터 우리페이지 */}
    <Route path="/login" element={<Login />} />
    <Route path="/403" element={<NotAllowed />} />

    {/* 기본 접근 루트 */}
    <Route path="/" element={<Layout />} />
      {/* 역할별 기본 분기 (보호 X) */}
      {/* <Route index element={<HomeIndex />} /> 추후 주석 풀 예정 */}

      {/* 역할별 분기 샘플 */}
      {/* <Route element={<RoleRoute roles={['1' , '2']} />}>
        <Route path="main" element={<Main />} />
      </Route> */}
    {/* </Routes> */}
  </Routes>
  );
}

export default AppRoutes;
