// src/pages/mypage/UserProfile.jsx
import { useEffect, useState } from 'react';
import {
  getUserProfile,
  updateUserProfileInfo,
} from '../../../auth/authService';
import { uploadEvidenceFile } from '../../../attend/attendService';
import { useAccount } from '../../../auth/AuthContext';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const { user, patchUser } = useAccount();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    userProfileImage: null,
  });

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfile(res);
      setFormData({
        email: res.email,
        phoneNumber: res.phoneNumber,
        userProfileImage: res.userProfileImage || null,
      });
      setPreviewUrl(
        res.userProfileImage
          ? `http://localhost:940/api/files/id/${res.userProfileImage}`
          : null
      );
    } catch (e) {
      console.error(e);
      toast.error('프로필 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  const formatPhone = (phone) => {
    if (!phone) return '-';
    const onlyNum = phone.replace(/\D/g, '');
    if (onlyNum.length === 11) {
      return onlyNum.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    if (onlyNum.length === 10) {
      return onlyNum.replace(/(\d{2,3})(\d{3,4})(\d{4})/, '$1-$2-$3');
    }
    return phone;
  };

  const formatBrNo = (brno) => {
    if (!brno || brno.length !== 10) return brno;
    return `${brno.substring(0, 3)}-${brno.substring(3, 5)}-${brno.substring(
      5
    )}`;
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ 프로필 사진 업로드
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      setFormData((prev) => ({ ...prev, userProfileImage: fileSn }));
      setPreviewUrl(`http://localhost:940/api/files/id/${fileSn}`);

      toast.info('사진이 변경되었습니다. "edit" 버튼을 눌러야 저장됩니다.');
    } catch (err) {
      console.error(err);
      toast.error('업로드 실패');
    }
  };

  // ✅ edit 버튼 → DB 반영
  const handleSave = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.length !== 11) {
      toast.error('휴대폰 번호는 숫자 11자리여야 합니다.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error('올바른 이메일 주소를 입력하세요.');
      return;
    }

    try {
      await updateUserProfileInfo({
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        userProfileImage: formData.userProfileImage,
      });

      patchUser({
        ...profile,
        USER_PROFILE_IMAGE: formData.userProfileImage,
        USER_EML_ADDR: formData.email,
        USER_TELNO: formData.phoneNumber,
      });

      toast.success('프로필이 수정되었습니다.');
      fetchProfile();
    } catch (err) {
      console.error(err);
      toast.error('수정 실패');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!profile) return <p>데이터 없음</p>;

  // ✅ 권한 번호
  const authSn = user?.USER_AUTHRT_SN;

  return (
    <section className="myInfoSection">
      <h2 className="myInfoTitle myInfoTitleA">
        {profile.name} ({profile.status})
        <button className="myInfoEditBtn" onClick={handleSave}>
          edit
        </button>
      </h2>

      <div className="myInfoContent">
        {/* 프로필 사진 */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <label htmlFor="fileInput" className="myInfoPhoto">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="프로필"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span>사진 업로드</span>
            )}
          </label>
          <input
            id="fileInput"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          {formData.userProfileImage && (
            <button
              className="deleteBtn"
              onClick={() => {
                setFormData((prev) => ({ ...prev, userProfileImage: null }));
                setPreviewUrl(null);
                toast.info(
                  '사진이 삭제되었습니다. "edit" 버튼을 눌러야 저장됩니다.'
                );
              }}
            >
              삭제
            </button>
          )}
        </div>

        {/* 상세 정보 */}
        <div className="myInfoDetails">
          {/* 학생(5) / 강사(4) */}
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

          {/* 테넌트 관리자(2) / 직원(3) */}
          {(authSn === 2 || authSn === 3) && (
            <>
              <div className="myInfoRow">
                <span className="myInfoLabel">상호명</span>
                <span className="myInfoValue">{profile.companyName}</span>
              </div>
              <div className="myInfoRow">
                <span className="myInfoLabel">사업자번호</span>
                <span className="myInfoValue">{formatBrNo(profile.brNo)}</span>
              </div>
            </>
          )}

          {/* 공통 */}
          <div className="myInfoRow">
            <span className="myInfoLabel">휴대폰 번호</span>
            <input
              type="text"
              className="myInfoInput"
              value={formatPhone(profile.phoneNumber)}
              maxLength={11}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  phoneNumber: e.target.value.replace(/[^0-9]/g, ''), // 숫자만
                }))
              }
              placeholder="숫자 11자리"
            />
          </div>
          <div className="myInfoRow">
            <span className="myInfoLabel">이메일</span>
            <input
              type="text"
              className="myInfoInput"
              value={formData.email}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, email: e.target.value }))
              }
              placeholder="example@test.com"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
