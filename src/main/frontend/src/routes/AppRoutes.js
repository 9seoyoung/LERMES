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
import AdminHome  from '../pages/LMS/AdminHome';
import TutorHome from '../pages/LMS/TutorHome';
import StdHome from '../pages/LMS/StdHome';
import WelcomeLayout from '../components/layout/WelcomeLayout';
import TenantSignup from '../auth/loginPage/TenantSignup';
import MiniCal from '../components/ui/MiniCal';
import BigCal from '../components/ui/BigCal';
import UiComp from '../components/ui/UiComp';
import SignUp from "../auth/loginPage/SignUp";

function AppRoutes() {
  return (
  <Routes>
    {/*기본루트*/}
    <Route index element={<Layout></Layout>}/>

    {/* 매니저님이 짜주신 샘플 코드 */}
    <Route path="/sample" element={<SampleApp />} />
    <Route path="/sign" element={<SignUp />} />

    {/* 여기서 부터 우리페이지 */}
    <Route path="/403" element={<NotAllowed />} />
    <Route path="/login" element={<Login />} />
    <Route path="/minical" element={<MiniCal />} />
    <Route path="/bigcal" element={<BigCal />} />
    <Route path="/ui" element={<UiComp />} />


    {/* 로그인/회원가입 레이아웃 */}
    <Route path ='welcome' element={<WelcomeLayout/>} >
      <Route path='generaljoin' element={<GeneralJoin/>} />
      <Route path='tenantjoin' element={<TenantSignup/>}/>
      <Route path='login' element={<Login />} />
      <Route path='tenantjoin' element={<TenantSignup />} />
    </Route>
    
    {/* 기본 접근 루트 */}
    <Route path="/" element={<Layout />}>
      <Route path='superMain' element={<SuperMain/>}/>
      <Route path='adminHome' element={<AdminHome/>} />
      <Route path='tutorHome' element={<TutorHome/>} />
      <Route path='stdHome' element={<StdHome/>} />

      {/* 역할별 기본 분기 (보호 X) */}
      {/* <Route index element={<HomeIndex />} /> 추후 주석 풀 예정 */}

      {/* <Route element={<RoleRoute roles={['1']} />}>
        <Route path="superMain" element={<SuperMain />} />
      </Route> */}
      {/* 관리자(테넌트, 직원) */}
      {/* <Route element={<RoleRoute roles={['2','3']} />}>
        <Route path="adminHome" element={<AdminHome />} />
      </Route> */}
      {/* 강사 */}
      {/* <Route element={<RoleRoute roles={['4']} />}>
        <Route path="tutorHome" element={<TutorHome />} />
      </Route> */}
      {/* 수강생 */}
      {/* <Route element={<RoleRoute roles={['4']} />}>
        <Route path="stdHome" element={<TutorHome />} />
      </Route> */}
      {/* 일반회원 */}
      {/* <Route element={<RoleRoute roles={['4']} />}>
        <Route path="stdHome" element={<TutorHome />} />
      </Route> */}
    {/* </Routes> */}
    </Route>
  </Routes>
  );
}

export default AppRoutes;
