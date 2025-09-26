import { useEffect, useState } from 'react';
import { getUserProfile } from '../../../auth/authService';
import { toast } from 'react-toastify';

export default function UserProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await getUserProfile();
      setProfile(res);
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

  if (loading) return <p>로딩 중...</p>;
  if (!profile) return <p>데이터 없음</p>;

  return (
    <section className="myInfoSection">
      {/* ✅ 컴포넌트 전용 CSS */}
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
          gap: 8px;
          font-size: 20px;
          font-weight: bold;
        }

        .myInfoEditBtn {
          font-size: 12px;
          background: #eee;
          border: none;
          border-radius: 4px;
          padding: 2px 6px;
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
        }

        .myInfoDetails {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .myInfoRow {
          display: flex;
          gap: 10px;
          align-items: center;
        }

        .myInfoLabel {
          font-weight: 600;
          color: #555;
          background: #f5f5f5;
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 14px;
        }

        .myInfoValue {
          color: #222;
          font-size: 14px;
        }
      `}</style>

      <h2 className="myInfoTitle">
        {profile.name} ({profile.status})
        <button className="myInfoEditBtn">edit</button>
      </h2>

      <hr className="myInfoDivider" />

      <div className="myInfoContent">
        {/* 왼쪽: 사진 영역 */}
        <div className="myInfoPhoto">사진</div>

        {/* 오른쪽: 상세 정보 */}
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
            <span className="myInfoValue">{profile.phoneNumber}</span>
          </div>

          <div className="myInfoRow">
            <span className="myInfoLabel">이메일</span>
            <span className="myInfoValue">{profile.email}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
