// src/components/layout/inho/CompanyInfoForm.jsx
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import {
  saveCompanyDetail,
  updateCompanySmallLogo,
  deleteCompanySmallLogo,
  fetchCompany,
} from '../../../auth/authService';
import { uploadEvidenceFile } from '../../../attend/attendService'; // 파일 업로드용
import { useAccount } from '../../../auth/AuthContext'; // 로그인 유저 정보
import './CompanyInfoForm.css';

const CompanyInfoForm = () => {
  const { user } = useAccount();
  const companyId = user?.USER_OGDP_CO_SN;

  const [form, setForm] = useState({
    companyId: null,
    companyName: '',
    companyTel: '',
    companyAddress: '',
    companyAddressDetail: '',
    companyLogo: null,
    bizLicenseNo: '제 2025-서울강남-12345호',
  });
  const [loading, setLoading] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const [open, setOpen] = useState(false);

  // ✅ 전화번호 포맷 함수
  const formatPhone = (tel) => {
    if (!tel) return '';
    const digits = tel.replace(/\D/g, '');
    if (digits.length === 10) {
      return digits.replace(/(\d{2})(\d{4})(\d{4})/, '$1-$2-$3');
    } else if (digits.length === 11) {
      return digits.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    }
    return tel;
  };

  // Daum 주소검색 API 로드
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

  // 회사 상세 조회
  const fetchCompanyDetail = async () => {
    if (!companyId) return;
    try {
      setLoading(true);
      const detail = await fetchCompany(companyId);
      console.log('📌 회사 정보 응답:', detail);
      if (detail) {
        setForm({
          companyId: detail.id || companyId,
          companyName: detail.name || '',
          companyTel: formatPhone(detail.companyTel) || '', // ✅ 포맷 적용
          companyAddress: detail.companyAddress || '',
          companyAddressDetail: detail.companyAddressDetail || '',
          companyLogo: detail.smallLogoFileSn || null,
          bizLicenseNo: '제 2025-서울강남-12345호',
        });
      }
    } catch (e) {
      console.error('❌ 회사 정보 불러오기 실패:', e);
      toast.error('회사 정보 불러오기 실패');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanyDetail();
  }, [companyId]);

  // input 값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'companyTel') {
      // 입력 중에도 포맷 적용
      const digits = value.replace(/\D/g, '');
      setForm((prev) => ({ ...prev, companyTel: formatPhone(digits) }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  // 주소검색 팝업
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

  // 회사 로고 업로드 (DB 저장 안 함, state만 세팅)
  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const uploaded = await uploadEvidenceFile(file);
      setForm((prev) => ({ ...prev, companyLogo: uploaded.fileSn }));
      toast.info('로고 선택 완료. 저장 버튼을 눌러야 반영됩니다.');
    } catch (e) {
      console.error(e);
      toast.error('로고 업로드 실패');
    }
  };

  // 회사 로고 삭제 (DB 저장 안 함, state만 세팅)
  const handleLogoDelete = () => {
    setForm((prev) => ({ ...prev, companyLogo: null }));
    toast.info('로고 삭제됨. 저장 버튼을 눌러야 반영됩니다.');
  };

  // 저장
  const handleSave = async () => {
    if (!form.companyId) {
      toast.error('회사 ID가 없습니다.');
      return;
    }

    try {
      setLoading(true);

      // 전화번호 저장 시 하이픈 제거
      const payload = {
        name: form.companyName,
        companyTel: form.companyTel.replace(/-/g, ''), // ← DB에는 - 없이 저장
        companyAddress: form.companyAddress,
        companyAddressDetail: form.companyAddressDetail,
        smallLogoFileSn: form.companyLogo,
      };

      // companyId 따로 넘겨줌
      const res = await saveCompanyDetail(form.companyId, payload);

      if (res) {
        toast.success('회사 정보 저장 성공');
        setForm((prev) => ({
          ...prev,
          companyId: res.id || form.companyId,
          companyName: res.name || '',
          companyTel: formatPhone(res.companyTel) || '',
          companyAddress: res.companyAddress || '',
          companyAddressDetail: res.companyAddressDetail || '',
          companyLogo: res.smallLogoFileSn || null,
        }));
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
              id="companyLogoUpload"
              type="file"
              accept="image/*"
              style={{ display: 'none' }} // ← 기본 UI 숨김
              onChange={handleLogoChange}
            />

            <label htmlFor="companyLogoUpload" className="companyLogoSelectBtn">
              파일 선택
            </label>
            <span>{form.companyLogoName || ''}</span>
            <button
              type="button"
              className="companyInfoButton"
              onClick={handleLogoDelete}
            >
              삭제
            </button>
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
