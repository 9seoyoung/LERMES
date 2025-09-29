// src/components/layout/inho/CompanyBigLogoUploader.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  updateCompanyBigLogo,
  deleteCompanyBigLogo,
  fetchCompany,
} from '../../../auth/authService';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { uploadEvidenceFile } from '../../../attend/attendService';
import cardStyle from '../../../styles/superMain.module.css'; // 카드 CSS 재사용

export default function CompanyBigLogoUploader() {
  const { user } = useAccount();
  const { effectiveSn } = useSelectedCompany();
  const [logoFileSn, setLogoFileSn] = useState(null);
  const [company, setCompany] = useState(null);

  useEffect(() => {
    if (effectiveSn) {
      fetchCompany(effectiveSn)
        .then((data) => {
          setLogoFileSn(data.bigLogoFileSn);
          setCompany(data);
        })
        .catch(() => {
          setLogoFileSn(null);
          setCompany(null);
        });
    }
  }, [effectiveSn]);

  const canEdit =
    (user?.USER_AUTHRT_SN === 1 ||
      user?.USER_AUTHRT_SN === 2 ||
      user?.USER_AUTHRT_SN === 3) &&
    String(effectiveSn) === String(user?.USER_OGDP_CO_SN);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      await updateCompanyBigLogo(user?.USER_OGDP_CO_SN, fileSn);
      setLogoFileSn(fileSn);
      toast.success('빅 로고 변경 완료!');
    } catch (err) {
      console.error(err);
      toast.error('빅 로고 업로드 실패');
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCompanyBigLogo(user?.USER_OGDP_CO_SN);
      setLogoFileSn(null);
      toast.success('빅 로고 삭제 완료!');
    } catch (err) {
      console.error(err);
      toast.error('빅 로고 삭제 실패');
    }
  };

  return (
    <div
      className="companyCardRoot"
      style={{
        padding: '40px 0px 48px 130px',
        borderLeft: '1px solid #D9D9D9',
      }}
    >
      <div className={cardStyle.company_card}>
        {/* 상단: 로고 영역 */}
        <div
          style={{
            flex: 1,
            width: '345px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            backgroundImage: logoFileSn
              ? `url(http://localhost:940/api/files/id/${logoFileSn})`
              : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          {!logoFileSn && <div style={{ color: '#666' }}>회사 빅 로고</div>}

          {canEdit && (
            <div
              style={{
                position: 'absolute',
                top: '8px',
                right: '8px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <label
                htmlFor="bigLogoUpload"
                style={{
                  background: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
              >
                변경
              </label>
              <input
                id="bigLogoUpload"
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <button
                onClick={handleDelete}
                style={{
                  background: 'rgba(0,0,0,0.75)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  padding: '4px 10px',
                  cursor: 'pointer',
                }}
              >
                삭제
              </button>
            </div>
          )}
        </div>

        {/* 하단: 회사 정보 + 버튼 */}
        <div className={cardStyle.card_bottom}>
          <p className={cardStyle.title}>{company?.name || '회사명 없음'}</p>
          <p>소재지 {company?.address || 'undefined'}</p>

          <div className={cardStyle.row}>
            <button>LMS 바로가기</button>
            <button>상태변수</button>
          </div>
        </div>
      </div>
    </div>
  );
}
