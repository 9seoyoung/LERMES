// src/components/layout/inho/CompanyInfoForm.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  getCompanyDetail,
  saveCompanyDetail,
  updateCompanyLogo,
} from '../../../auth/authService';
import '../../../styles/MyInfo.css';

const CompanyInfoForm = () => {
  const [form, setForm] = useState({
    companyName: '',
    companyTel: '',
    companyAddress: '',
    companyAddressDetail: '',
    companyLogo: null,
    bizLicenseNo: '제 2025-서울강남-12345호', // 하드코딩
  });
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (window.daum && window.daum.Postcode) {
      setScriptLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src =
      '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
    script.async = true;
    script.onload = () => setScriptLoaded(true);
    document.body.appendChild(script);
  }, []);

  const fetchCompanyDetail = async () => {
    try {
      setLoading(true);
      const detail = await getCompanyDetail();
      if (detail) {
        setForm({
          companyName: detail.companyName || '',
          companyTel: detail.companyTel || '',
          companyAddress: detail.companyAddress || '',
          companyAddressDetail: detail.companyAddressDetail || '',
          companyLogo: detail.companyLogo || null,
          bizLicenseNo: '제 2025-서울강남-12345호',
        });
      }
    } catch (e) {
      console.error(e);
      toast.error('회사 정보 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetail();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const openPostcode = () => {
    if (!scriptLoaded) {
      toast.error('주소 검색 모듈이 아직 로드되지 않았습니다.');
      return;
    }
    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({
          ...prev,
          companyAddress: data.roadAddress,
        }));
      },
    }).open();
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploaded = await updateCompanyLogo(file);
      setForm((prev) => ({ ...prev, companyLogo: uploaded.fileSn }));
      toast.success('회사 로고 변경 완료');
    } catch (e) {
      console.error(e);
      toast.error('로고 업로드 실패');
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const res = await saveCompanyDetail(form);
      if (res) {
        toast.success('회사 정보 저장 성공');
        setForm({
          companyName: res.companyName || '',
          companyTel: res.companyTel || '',
          companyAddress: res.companyAddress || '',
          companyAddressDetail: res.companyAddressDetail || '',
          companyLogo: res.companyLogo || null,
          bizLicenseNo: '제 2025-서울강남-12345호',
        });
      } else {
        toast.error('회사 정보 저장 실패');
      }
    } catch (e) {
      console.error(e);
      toast.error('저장 중 오류 발생');
    } finally {
      setLoading(false);
    }
  };
  return (
    <section className="companyInfoSection companyInfoSectionB">
      <h2
        className="companyInfoTitle"
        onClick={() => setOpen((prev) => !prev)}
        style={{ cursor: 'pointer' }}
      >
        <div>회사 상세 정보</div>
        <span style={{ border: 'none' }}>({open ? '접기' : '펼치기'})</span>
      </h2>

      {open && (
        <div className="companyInfoForm">
          <div className="companyInfoRow">
            <span className="companyInfoLabel">상호명</span>
            <input
              type="text"
              name="companyName"
              value={form.companyName}
              onChange={handleChange}
              className="companyDetailInfoInput"
            />
          </div>

          <div className="companyInfoRow">
            <span className="companyInfoLabel">회사 전화번호</span>
            <input
              type="text"
              name="companyTel"
              value={form.companyTel}
              onChange={handleChange}
              className="companyDetailInfoInput"
              placeholder="02-1234-5678"
            />
          </div>

          <div className="companyInfoRow">
            <span className="companyInfoLabel">회사 주소</span>
            <input
              type="text"
              name="companyAddress"
              value={form.companyAddress}
              className="companyDetailInfoInput"
              placeholder="주소 검색 버튼 클릭"
              readOnly
            />
            <button
              type="button"
              onClick={openPostcode}
              className="companyInfoAddressButton"
              disabled={!scriptLoaded}
            >
              주소 검색
            </button>
          </div>

          <div className="companyInfoRow">
            <span className="companyInfoLabel">상세 주소</span>
            <input
              type="text"
              name="companyAddressDetail"
              value={form.companyAddressDetail}
              onChange={handleChange}
              className="companyDetailInfoInput"
              placeholder="상세 주소 입력"
            />
          </div>

          <div className="companyInfoRow">
            <span className="companyInfoLabel">회사 로고</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="companyDetailInfoInput"
            />
          </div>

          <div className="companyInfoRow">
            <span className="companyInfoLabel">통신판매 신고번호</span>
            <input
              type="text"
              value={form.bizLicenseNo}
              readOnly
              className="companyDetailInfoInput"
            />
          </div>

          <div className="companyInfoActions">
            <button
              className="companyInfoButton"
              onClick={handleSave}
              disabled={loading}
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
};

export default CompanyInfoForm;
