import FindId from "../auth/loginPage/FindId";
import FindPw from "../auth/loginPage/FindPw";
import GeneralJoin from "../auth/loginPage/GeneralJoin";
import OAuth2Redirect from "../auth/loginPage/GoogleOAuth2Redirect";
import Login from "../auth/loginPage/Login";
import TenantSignup from "../auth/loginPage/TenantSignup";
import Layout2 from "../components/layout/Real/Layout2";
import SuperMain from "../pages/Super/SuperMain";
import Root from "./layouts/Root";
import { seg } from "./routeAddress";

export default [
  {
    path: "/",
    element: <Root></Root>,
    children: [
      {
        index: true, element: <Layout2></Layout2>, // 슈퍼메인 레이아웃
        children: [
          { index: true, element: <SuperMain></SuperMain> }, //랜딩화면 기본
        ]
      },
      {
        path: seg.LOGIN, element: <></>, // 로그인 레이아웃
        children: [
          { index: true, element: <Login></Login>}, // 로그인창 기본
          { path: seg.OAUTH2, element: <OAuth2Redirect />},
          { path: seg.FORGOTID, element: <FindId></FindId>},
          { path: seg.FORGOTPW, element: <FindPw></FindPw>},
        ]
      },
      {
        path: seg.WELCOME, element: <></>, //로그인 레이아웃이랑 동일
        children: [
          { path: seg.GENERAL, element: <GeneralJoin></GeneralJoin>},
          { path: seg.BUSINESS, element: <TenantSignup></TenantSignup>}
        ]
      }
    ]
  }
];