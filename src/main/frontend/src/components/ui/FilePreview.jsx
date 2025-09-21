import { useState, useEffect } from "react";
import style from "../../styles/SignUp.module.css";

function FilePreview() {
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    // 브라우저 임시 URL 생성
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
  };

  // 메모리 누수 방지: 언마운트되면 revoke
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ display: "none" }}
        id="profile-input"
      />
      <label htmlFor="profile-input" style={{ cursor: "pointer" }}>
        {preview ? (
            <img
                src={preview}
                alt="프로필 미리보기"
            />
        ) : (
          <div
            className={style.logoImg}
          >
            로고 180px * 60px
          </div>
        )}
      </label>
    </div>
  );
}

export default FilePreview;
