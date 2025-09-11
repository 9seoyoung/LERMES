// 라이브러리
import { BrowserRouter, Navigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";

//페이지
import AppRoutes from "./routes/AppRoutes";

//스타일


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
        />
      </BrowserRouter>
  );
}