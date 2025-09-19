import React, { useState } from 'react';

const API_BASE = 'http://localhost:940/api/files';

export default function UploadDownloadDemo() {
  const [files, setFiles] = useState([]);              // File[]
  const [results, setResults] = useState([]);          // UploadResultDTO[]

  const onChange = (e) => {
    const list = Array.from(e.target.files || []);
    setFiles(list);
    setResults([]); // 새 선택 시 결과 초기화
  };

  const onUpload = async () => {
    if (files.length === 0) return;
    const form = new FormData();
    // 서버 컨트롤러 @RequestPart("files") List<MultipartFile> 와 키 일치
    files.forEach(f => form.append('files', f));

    const res = await fetch(`${API_BASE}/batch`, {
      method: 'POST',
      body: form,
      credentials: 'include'
    });
    if (!res.ok) {
      alert('업로드 실패');
      return;
    }
    const json = await res.json(); // List<UploadResultDTO>
    setResults(json);
  };

  const openPreview = (r) => {
    const url = `${API_BASE}/${encodeURIComponent(r.storedFileName)}/preview?original=${encodeURIComponent(r.originalFileName || '')}`;
    window.open(url, '_blank');
  };

  const openDownload = (r) => {
    const url = `${API_BASE}/${encodeURIComponent(r.storedFileName)}/download?original=${encodeURIComponent(r.originalFileName || '')}`;
    window.open(url, '_blank');
  };

  return (
      <div style={{ maxWidth: 520, margin: '2rem auto', fontFamily: 'sans-serif' }}>
        <h3>파일 다중 업로드/다운로드 데모</h3>

        <input type="file" multiple onChange={onChange} />
        <button onClick={onUpload} disabled={files.length === 0} style={{ marginLeft: 8 }}>
          업로드 ({files.length}개)
        </button>

        {/* 선택한 파일 간단 미리보기 (이미지) */}
        {files.length > 0 && (
            <div style={{ marginTop: 12 }}>
              <div style={{ fontWeight: 600 }}>선택 목록</div>
              <ul>
                {files.map(f => (
                    <li key={f.name}>
                      {f.type?.startsWith('image/') && (
                          <img
                              src={URL.createObjectURL(f)}
                              alt={f.name}
                              style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 8, verticalAlign: 'middle' }}
                              onLoad={e => URL.revokeObjectURL(e.currentTarget.src)}
                          />
                      )}
                      <span>{f.name} ({Math.round(f.size/1024)} KB)</span>
                    </li>
                ))}
              </ul>
            </div>
        )}

        {/* 업로드 결과 */}
        {results.length > 0 && (
            <div style={{ marginTop: 16, padding: 12, border: '1px solid #ddd' }}>
              <div style={{ fontWeight: 600 }}>업로드 결과</div>
              <ul>
                {results.map(r => (
                    <li key={r.storedFileName} style={{ marginBottom: 8 }}>
                      {console.log(r)}
                      <div>원본: {r.originalFileName}</div>
                      <div>저장: {r.storedFileName}</div>
                      <div>크기: {r.size} bytes</div>
                      <div style={{ marginTop: 6 }}>
                        <button onClick={() => openPreview(r)} style={{ marginRight: 8 }}>미리보기</button>
                        <button onClick={() => openDownload(r)}>다운로드</button>
                      </div>
                    </li>
                ))}
              </ul>
            </div>
        )}
      </div>
  );
}