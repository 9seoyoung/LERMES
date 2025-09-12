// import { BrowserRouter, Routes, Route, Link , Navigate, useLocation} from 'react-router-dom';
import { BrowserRouter } from "react-router-dom";
// import GeneralSignup from './pages/GeneralSignup';
// import TenantSignup from './pages/TenantSignup';
// import Login from './pages/Login';
// import ProtectedRoute from './components/ProtectedRoute.jsx';
// 라이브러리
import { ToastContainer } from "react-toastify";

//페이지
import AppRoutes from "./routes/AppRoutes";

//스타일
// TODO-2025-09-12-구팡: 
export default function App() {

  return (
    <BrowserRouter>
      <AppRoutes />
        <ToastContainer
              autoClose={2000}
              closeOnClick={true}
              draggable={false}
              theme="light"
              position="top-center"
              style={{zIndex: "99999999"}}
            />
      {/* <nav className="nav">
        <Link to="/signup">일반가입</Link>
        <Link to="/signup/tenant">테넌트가입</Link>
        <Link to="/login">로그인</Link>
      </nav> */}
      {/* <Routes> */}
        {/* <Route path="/signup" element={<GeneralSignup />} /> */}
        {/* <Route path="/signup/tenant" element={<TenantSignup />} /> */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="*" element={<GeneralSignup />} /> */}
      {/* </Routes> */}
    </BrowserRouter>
//      <BrowserRouter>
//          <AppRoutes />
//        <ToastContainer
//          autoClose={2000}
//          closeOnClick={true}
//          draggable={false}
//          theme="light"
//          position="top-center"
//        />
//      </BrowserRouter>
  );
}
