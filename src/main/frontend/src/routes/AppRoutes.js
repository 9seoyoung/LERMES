import { Routes, Route } from 'react-router-dom';

// 권한
import RoleRoute from '../auth/RoleRoute.jsx';

//페이지
import Login from '../auth/loginPage/Login';
import Layout from '../components/layout/Layout'; //제일 먼저 만들어야 할 파일
import NotAllowed from '../auth/loginPage/NotAllowed';
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
import NoticeList from '../components/module/NoticeList.jsx';
import Board from '../pages/LMS/Board.jsx';
import CreatePost from '../pages/LMS/form/CreatePost.jsx';
import UploadDownloadDemo from "../pages/UploadDownloadDemo";

function AppRoutes() {
  return (
  <Routes>
    {/* 매니저님이 짜주신 샘플 코드 */}
    <Route path="/sample" element={<SampleApp />} />

    {/* 테스트 페이지 */}
    <Route path="/minical" element={<MiniCal />} />
    <Route path="/bigcal" element={<BigCal />} />
    <Route path="/ui" element={<UiComp />} />
    <Route path='/test' element={<NoticeList />} />

    <Route path="/files" element={<UploadDownloadDemo />} />

    {/* 에러페이지 */}
    <Route path="/403" element={<NotAllowed />} />

    {/* 로그인/회원가입 레이아웃 */}
    <Route path ='welcome' element={<WelcomeLayout/>} >
      <Route path='generaljoin' element={<GeneralJoin/>} />
      <Route path='tenantjoin' element={<TenantSignup />} />
      <Route path='login' element={<Login />} />
    </Route>

    {/*기본 레이아웃*/}
  <Route path='/' element={<Layout></Layout>} >

    
    {/* 기본 접근 루트 */}
      <Route index path='superMain' element={<SuperMain/>}/>
      {/* <Route path="generalHome" element={<GeneralHome />} /> */}

      {/* 관리자(테넌트, 직원) */}
      <Route element={<RoleRoute roles={[1, 2, 3]} />}>
        <Route path="adminHome" element={<AdminHome />} />
        {/* <Route path='adminHome/createPost' element={<CreatePost/>}></Route> */}

      </Route>
      {/* 강사 */}
      <Route element={<RoleRoute roles={[1, 4]} />}>
        <Route path="tutorHome" element={<TutorHome />} />
        {/* <Route path='tutorHome/createPost' element={<CreatePost/>}></Route> */}

      </Route>
      {/* 수강생 */}
      <Route element={<RoleRoute roles={[1, 5]} />}>
        <Route path="stdHome" element={<StdHome />} />
        <Route path="stdHome/board" element={<Board />} />
        <Route path='stdHome/board/createPost' element={<CreatePost/>}></Route>
        <Route path="stdHome/studySched" element={"#"} />

      </Route>

    </Route>
  </Routes>
  );
}

export default AppRoutes;
