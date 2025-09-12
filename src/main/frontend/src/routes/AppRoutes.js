import { Routes, Route } from 'react-router-dom';

// 권한
// import RoleRoute from '../auth/RoleRoute'; 역할데이터 권한분기파일 생성후 주석 제거 예정

//페이지
// import HomeIndex from '../auth/HomeIndex'; useAccount 등 세션 생기면 추후 주석 풀 예정
import Login from '../auth/loginPage/Login';
import Layout from '../components/layout/Layout'; //제일 먼저 만들어야 할 파일
import NotAllowed from '../auth/NotAllowed';
import SampleApp from '../sample/SampleApp';
import GeneralJoin from '../auth/loginPage/GeneralJoin';
import SuperMain from '../pages/Super/SuperMain';

function AppRoutes() {
  return (
  <Routes>
    {/*기본루트*/}
    <Route index element={<Layout></Layout>}/>

    {/* 매니저님이 짜주신 샘플 코드 */}
    <Route path="/sample" element={<SampleApp />} />

    {/* 여기서 부터 우리페이지 */}
    <Route path="/login" element={<Login />} />
    <Route path='/generaljoin' element={<GeneralJoin/>}/>
    <Route path="/403" element={<NotAllowed />} />
    <Route path='/generalJoin' element={<GeneralJoin />} />
    {/* 기본 접근 루트 */}
    <Route path="/" element={<Layout />}>
      <Route path='superMain' element={<SuperMain/>} />
      {/* 역할별 기본 분기 (보호 X) */}
      {/* <Route index element={<HomeIndex />} /> 추후 주석 풀 예정 */}

      {/* 역할별 분기 샘플 */}
      {/* <Route element={<RoleRoute roles={['1' , '2']} />}>
        <Route path="main" element={<Main />} />
      </Route> */}
    {/* </Routes> */}
    </ Route>
  </Routes>
  );
}

export default AppRoutes;
