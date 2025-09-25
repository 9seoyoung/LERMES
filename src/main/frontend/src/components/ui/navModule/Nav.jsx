import { useNavigate } from "react-router-dom"
import { useAccount } from "../../../auth/AuthContext";
import { useSelectedCompany } from "../../../contexts/SelectedCompanyContext";

export function Nav({setNavToggle}) {
    const { user, fetchedOnce } = useAccount();
    const { clearFixedSn, effectiveSn } = useSelectedCompany();
    const navigate = useNavigate();
    
    if (!fetchedOnce) {
        return <div className="navCont">로딩중…{/* 스켈레톤 */}</div>;
    }

    const myCoSn = user?.USER_OGDP_CO_SN;


    
/** Nav
 * 0. 이미 경로로 접근한 상태 >>>>>>>
 * 1. effectiveSn과 내 회사 SN이 다르면 VistiorNav 메뉴
 * 2. 같으면 권한레벨에 따라 메뉴 다르게 보임
 */

    return (
        <div className="navCont">
        <div className="navMenuCont">
            <div className="navMyInfo">
                <img src="#" alt="사용자 프로필"></img>
                <div className="infoWrap">
                    <div style={{fontSize: "18px", fontWeight:"600"}}>{user?.USER_NM}</div>
                    <div>{user?.USER_EML_ADDR}</div>
                </div>
                <button type="button" className="lmsMyInfoBtn"  style={{fontSize: "14px"}}>
                    내 정보
                </button> 
            </div>
            <div className="navMenuList">
            {effectiveSn !== myCoSn ? 
                <div onClick={() => navigate('/visitorHome')}>홈</div>
                :
                <>
                    {user?.USER_AUTHRT_SN === 1 ? 
                        <>
                            <div onClick={() => navigate('/adminHome')}>관리자 홈</div>
                            <div onClick={() => navigate('/adminHome/groupSet')}>과정 관리</div>            
                            <div onClick={() => navigate('/adminHome/boardSet')}>게시물 관리</div>
                            <div onClick={() => navigate('/adminHome/accountSet')}>계정 관리</div>                
                            <div onClick={() => navigate('/adminHome/docuSet')}>서류 관리</div>   
                            <hr></hr>
                            <div onClick={() => navigate('/tutorHome')}>강사 홈</div>
                            <div onClick={() => navigate('/tutorHome/studySched')}>학습 관리</div>
                            <div onClick={() => navigate('/tutorHome/studentManage')}>수강생 관리</div>                
                            <div onClick={() => navigate('/tutorHome/board')}>게시판</div>              
                            <hr></hr>
                            <div onClick={() => navigate('/stdHome')}>수강생 홈</div>
                            <div onClick={() => navigate('/stdHome/studySched')}>학습 일정</div>
                            <div onClick={() => navigate('/stdHome/board')}>게시판</div>
                            <hr></hr>
                            <div onClick={() => navigate('/visitorHome')}>방문자 홈</div>
                        </>
                        :
                        <>
                            { (user?.USER_AUTHRT_SN === 2) || (user?.USER_AUTHRT_SN === 3) ?
                                <>
                                    <div onClick={() => navigate('/adminHome')}>관리자 홈</div>
                                    <div onClick={() => navigate('/adminHome/groupSet')}>과정 관리</div>            
                                    <div onClick={() => navigate('/adminHome/boardSet')}>게시물 관리</div>
                                    <div onClick={() => navigate('/adminHome/accountSet')}>계정 관리</div>                
                                    <div onClick={() => navigate('/adminHome/docuSet')}>서류 관리</div>   
                                </>
                                :
                                <>
                                    {user?.USER_AUTHRT_SN === 4 ? 
                                        <>
                                            <div onClick={() => navigate('/tutorHome')}>강사 홈</div>
                                            <div onClick={() => navigate('/tutorHome/studySched')}>학습 관리</div>
                                            <div onClick={() => navigate('/tutorHome/studentManage')}>수강생 관리</div>                
                                            <div onClick={() => navigate('/tutorHome/board')}>게시판</div>        
                                        </>
                                        :
                                        <>
                                            {/** 권한 5 ------ 나머지는 회사SN이 없어서 자동 vistor메뉴 */}
                                            <div onClick={() => navigate('/stdHome')}>수강생 홈</div>
                                            <div onClick={() => navigate('/stdHome/studySched')}>학습 일정</div>
                                            <div onClick={() => navigate('/stdHome/board')}>게시판</div>
                                        </>
                                    }
                                </>
                            }
                        </>
                    }
                </>
            }
            </div>
        </div>
        <div className="goSuper" onClick={() => {navigate('/'); setNavToggle(false); clearFixedSn(); }}>
            <div>
                LERMES로 돌아가기
            </div>
        </div>
    </div>
  )
}
