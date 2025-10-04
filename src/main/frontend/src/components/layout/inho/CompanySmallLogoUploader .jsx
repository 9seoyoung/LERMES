// src/components/layout/inho/CompanySmallLogoUploader.jsx
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import {
  updateCompanySmallLogo,
  deleteCompanySmallLogo,
  fetchCompany,
} from '../../../auth/authService';
import { useAccount } from '../../../auth/AuthContext';
import { useSelectedCompany } from '../../../contexts/SelectedCompanyContext';
import { uploadEvidenceFile } from '../../../attend/attendService';
import './CompanyLogo.css';

export default function CompanySmallLogoUploader() {
  const { user } = useAccount();
  const { effectiveSn } = useSelectedCompany();

  const [logoFileSn, setLogoFileSn] = useState(null);

  useEffect(() => {
    if (effectiveSn) {
      fetchCompany(effectiveSn)
        .then((company) => setLogoFileSn(company.smallLogoFileSn))
        .catch(() => setLogoFileSn(null));
    }
  }, [effectiveSn]);

  const canEdit =
    (user?.USER_AUTHRT_SN === 1 ||
      user?.USER_AUTHRT_SN === 2 ||
      user?.USER_AUTHRT_SN === 3) &&
    String(effectiveSn) === String(user?.USER_OGDP_CO_SN);

  // 파일 업로드
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const uploaded = await uploadEvidenceFile(file);
      const fileSn = uploaded.fileSn;

      await updateCompanySmallLogo(user?.USER_OGDP_CO_SN, fileSn);
      setLogoFileSn(fileSn);
      toast.success('미니 로고 변경 완료!');
    } catch (err) {
      console.error(err);
      toast.error('로고 업로드 실패');
    }
  };

  // 로고 삭제
  const handleDelete = async () => {
    try {
      await deleteCompanySmallLogo(user?.USER_OGDP_CO_SN);
      setLogoFileSn(null);
      toast.success('미니 로고 삭제 완료!');
    } catch (err) {
      console.error(err);
      toast.error('로고 삭제 실패');
    }
  };

  return (
    <div
      className="logoBox"
      style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
    >
      {/* 로고 영역 */}
      {/* <div className="logoWrapper">
        {logoFileSn ? (
          <img
            src={`http://localhost:940/api/files/id/${logoFileSn}`}
            alt="회사 로고"
            className="companyLogo"
          />
        ) : (
          <div className="logoPlaceholder">회사 로고</div>
        )}
      </div> */}

      {/* 버튼 영역 (세로 배치) */}
      {canEdit && (
        <div
          className="logoButtons"
          style={{ display: 'none', flexDirection: 'column', gap: '5px' }}
        >
          <label htmlFor="smallLogoUpload" className="btn">
            변경
          </label>
          <input
            id="smallLogoUpload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button className="btn" onClick={handleDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
