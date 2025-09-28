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
  const { patchUser } = useAccount();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const [formData, setFormData] = useState({
    email: '',
    phoneNumber: '',
    userProfileImage: null,
  });

  // ✅ 프로필 불러오기
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

  useEffect(() => {
    fetchProfile();
  }, []);

  // ✅ 프로필 사진 업로드 (edit 버튼 누르기 전까지 formData에만 반영)
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

  // ✅ edit 버튼 눌러야 DB 반영 + 전역 상태 갱신
  const handleSave = async () => {
    // 휴대폰 번호 유효성 검사
    if (!formData.phoneNumber || formData.phoneNumber.length !== 11) {
      toast.error('휴대폰 번호는 숫자 11자리여야 합니다.');
      return;
    }

    // 이메일 유효성 검사 (aaa@bbb 형식까지 허용)
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!formData.email || !emailRegex.test(formData.email)) {
      toast.error('올바른 이메일 주소를 입력하세요. (예: user@domain)');
      return;
    }

    try {
      await updateUserProfileInfo({
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        userProfileImage: formData.userProfileImage,
      });

      // 👉 전역 user 갱신 (Nav에서도 즉시 반영됨)
      patchUser({
        ...profile,
        USER_PROFILE_IMAGE: formData.userProfileImage,
        USER_EML_ADDR: formData.email,
        USER_TELNO: formData.phoneNumber,
      });

      toast.success('프로필이 수정되었습니다.');
      fetchProfile(); // 화면도 다시 갱신
    } catch (err) {
      console.error(err);
      toast.error('수정 실패');
    }
  };

  if (loading) return <p>로딩 중...</p>;
  if (!profile) return <p>데이터 없음</p>;

  return (
    <section className="myInfoSection">
      <style>{`
        .myInfoSection {
          padding: 20px;
          border: 1px solid #ddd;
          border-radius: 12px;
          background: #fff;
          max-width: 600px;
          margin: 0 auto;
        }

        .myInfoTitle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 20px;
          font-weight: bold;
        }

        .myInfoEditBtn {
          font-size: 12px;
          background: #4caf50;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 4px 10px;
          cursor: pointer;
        }

        .myInfoDivider {
          margin: 10px 0;
          border: none;
          border-top: 1px solid #ccc;
        }

        .myInfoContent {
          display: flex;
          gap: 20px;
        }

        .myInfoPhoto {
          width: 120px;
          height: 150px;
          background: #ddd;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: #555;
          border-radius: 8px;
          overflow: hidden;
          cursor: pointer;
        }

        .myInfoDetails {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 16.5px;
        }

        .myInfoRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .myInfoLabel {
          flex: 0 0 100px;
          text-align: right;
          font-weight: 600;
          color: #555;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
        }

        .myInfoValue,
        .myInfoInput {
          flex: 1;
          font-size: 14px;
        }

        .myInfoInput {
          padding: 4px 6px;
          border: 1px solid #ccc;
          border-radius: 4px;
        }

        .deleteBtn {
          margin-top: 6px;
          font-size: 12px;
          background: #f44336;
          color: #fff;
          border: none;
          border-radius: 4px;
          padding: 2px 8px;
          cursor: pointer;
        }
      `}</style>

      <h2 className="myInfoTitle">
        {profile.name} ({profile.status})
        <button className="myInfoEditBtn" onClick={handleSave}>
          edit
        </button>
      </h2>

      <hr className="myInfoDivider" />

      <div className="myInfoContent">
        {/* 사진 */}
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
          <div className="myInfoRow">
            <span className="myInfoLabel">과정명</span>
            <span className="myInfoValue">{profile.courseName}</span>
          </div>
          <div className="myInfoRow">
            <span className="myInfoLabel">소속 그룹</span>
            <span className="myInfoValue">{profile.cohortName}</span>
          </div>
          <div className="myInfoRow">
            <span className="myInfoLabel">휴대폰 번호</span>
            <input
              type="text"
              className="myInfoInput"
              value={formData.phoneNumber}
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
