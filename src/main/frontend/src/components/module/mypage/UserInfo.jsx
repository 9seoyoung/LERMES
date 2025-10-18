import {toast} from "react-toastify";
import PasswordChangeModal from "../../layout/inho/PasswordChangeModal";
import MyInfoForm from "../../layout/inho/MyInfoForm";
import {UserCircle, UserCircle2, UserIcon, UserRound} from "lucide-react";

export function UserInfo({formData, setInfoEditToggle, profile, authSn, previewUrl, formatBrNo }){


    return (
        <section className="myInfoSection" style={{background:"white"}}>
            <h2 className="myInfoTitle myInfoTitleA">
                {profile.name} ({profile.status})
                <button className="myInfoEditBtn gray" onClick={() => setInfoEditToggle(true)}>
                    Edit
                </button>
            </h2>

            <div className="myInfoContent">
                <div id={"userInfoCont"}>
                    <div
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        {previewUrl ?
                            <div className="myInfoPhoto">
                        <img
                            src={previewUrl}
                            alt="프로필"
                            className="myInfoPhoto"
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                            </div>
                            :
                            <div className="myInfoPhoto">

                            <img
                            src={"/img/default-profile.png"}
                            alt="프로필"
                            className="myInfoPhoto"
                            style={{ width: '50%', height: '50%', objectFit: 'cover' }}
                        />
                            </div>
                        }
                    </div>

                    <div className="myInfoDetails">
                        {(authSn === 4 || authSn === 5) && (
                            <>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">과정명</span>
                                    <span className="myInfoValue">{profile.courseName}</span>
                                </div>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">소속 그룹</span>
                                    <span className="myInfoValue">{profile.cohortName}</span>
                                </div>
                            </>
                        )}

                        {(authSn === 2 || authSn === 3) && (
                            <>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">회사명</span>
                                    <span className="myInfoValue">{profile.companyName}</span>
                                </div>
                                <div className="myInfoRow">
                                    <span className="myInfoLabel">사업자번호</span>
                                    <span className="myInfoValue">{formatBrNo(profile.brNo)}</span>
                                </div>
                            </>
                        )}

                        <div className="myInfoRow">
                            <span className="myInfoLabel">휴대폰 번호</span>
                            <span
                                noborder={"no"}
                                className="myInfoInput"
                            >
                                {formData.phoneNumber}
                            </span>
                        </div>

                        <div className="myInfoRow">
                            <span className="myInfoLabel">이메일</span>
                            <span
                                noborder={"no"}
                            >
                                {formData.email}
                            </span>
                        </div>
                        <div style={{ textAlign: 'right', margin: '8px 0', width: '100%' }}>
                        </div>
                    </div>
                </div>
                <MyInfoForm />
            </div>
        </section>
    );
}