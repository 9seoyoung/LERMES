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
import AdminHome from '../pages/LMS/AdminHome';
import TutorHome from '../pages/LMS/TutorHome';
import StdHome from '../pages/LMS/StdHome';
import WelcomeLayout from '../components/layout/WelcomeLayout';
import TenantSignup from '../auth/loginPage/TenantSignup';
import MiniCal from '../components/ui/MiniCal';
import BigCal from '../components/ui/BigCal';
import UiComp from '../components/ui/UiComp';
import SchedList from '../components/ui/SchedList';
import SchedListPopUp from '../components/ui/SchedListPopUp';
import CalSched from '../components/ui/CalSched';
import NoticeList from '../components/module/NoticeList.jsx';
import Board from '../pages/LMS/Board.jsx';
import CreatePost from '../pages/LMS/form/CreatePost.jsx';
import UploadDownloadDemo from '../pages/UploadDownloadDemo.jsx';
import DocxSet from '../pages/LMS/DocxSet.jsx';
import AccountSet from '../pages/LMS/AccountSet.jsx';
import GroupSet from '../components/ui/navModule/GroupSet.jsx';
import VisitorHome from '../pages/LMS/VisitorHome.jsx';
import Mypage from '../pages/Mypage.jsx';
import BoardManage from '../pages/LMS/BoardManage.jsx'

function AppRoutes() {
  return (
    <Routes>
      {/* 매니저님이 짜주신 샘플 코드 */}
      <Route path="/sample" element={<SampleApp />} />

      {/* 테스트 페이지 */}
      <Route path="/bigcal" element={<BigCal />} />
      <Route path="/ui" element={<UiComp />} />
      <Route path="/test" element={<NoticeList />} />
      <Route path="/schedlist" element={<SchedList />} />
      <Route path="/schedlistpopup" element={<SchedListPopUp />} />
      <Route path="/calsched" element={<CalSched />} />

      <Route path="/files" element={<UploadDownloadDemo />} />

      {/* 에러페이지 */}
      <Route path="/403" element={<NotAllowed />} />

      {/* 로그인/회원가입 레이아웃 */}
      <Route path="welcome" element={<WelcomeLayout />}>
        <Route path="generaljoin" element={<GeneralJoin />} />
        <Route path="tenantjoin" element={<TenantSignup />} />
        <Route path="login" element={<Login />} />
      </Route>

    {/*기본 레이아웃*/}
  <Route path='/' element={<Layout></Layout>} >
    
    {/* 기본 접근 루트 */}
      <Route index element={<SuperMain/>}/>
      <Route path="visitorHome" element={<VisitorHome />} />
      <Route path='/myPage' element={<Mypage/>}/>


      {/* 관리자(테넌트, 직원) */}
      <Route element={<RoleRoute roles={[1, 2, 3]} />}>
        <Route path="adminHome" element={<AdminHome />} />
        <Route path="adminHome/boardSet" element={<BoardManage />} />
        <Route path="adminHome/groupSet" element={<GroupSet />} />
        <Route path='adminHome/boardSet/createPost' element={<CreatePost/>}></Route>
        <Route path='adminHome/docuSet' element={<DocxSet/>}></Route>
        <Route path='adminHome/accountSet' element={<AccountSet/>}></Route>
        <Route path=':home/myPage' element={<Mypage/>}/>

      </Route>
      {/* 강사 */}
      <Route element={<RoleRoute roles={[1, 4]} />}>
        <Route path="tutorHome" element={<TutorHome />} />
        <Route path="tutorHome/board" element={<Board />} />
        <Route path='tutorHome/createPost' element={<CreatePost/>}></Route>
        <Route path=':home/myPage' element={<Mypage/>}/>

      </Route>
      {/* 수강생 */}
      <Route element={<RoleRoute roles={[1, 5]} />}>
        <Route path="stdHome" element={<StdHome />} />
        <Route path="stdHome/board" element={<Board />} />
        <Route path='stdHome/board/createPost' element={<CreatePost/>}></Route>
        <Route path="stdHome/studySched" element={"#"} />
        <Route path=':home/myPage' element={<Mypage/>}/>

      </Route>

    </Route>
  </Routes>
  );
}

export default AppRoutes;
