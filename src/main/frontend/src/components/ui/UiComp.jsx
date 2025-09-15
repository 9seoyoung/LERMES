// 상호작용 컴포넌트
// props로 텍스트 조절할 수 있게
import { useState, useRef } from 'react';

import styles from '../../styles/UiComp.module.css';
import Dropdown from './Dropdown';
import FilePreview from './FilePreview';
// [props]
// FormInput, FormUnderline, TextAreaBox: textType(placeholder)
// FormBtn: textType(내용), className(style)
// CustomCheckbox: className(style)
// 그 외: X
export function UiComp() {
  return (
    <div>
      <FormInput />
      <FormUnderline />
      <FormBtn textType="저장"className={styles.grayBtn}/>
      <DeleteBtn  />
      <OptionSelect />
      <TextAreaBox />
      <CustomCheckbox />
      <FileUpload />
      <Table />
      {/* 드롭다운 사용 방법 */}
      <Dropdown label="드롭다운 제목" trigger="hover" placement="bottom-start" >
      <a className="dd__item" href="/mypage">내 정보</a>
      <a className="dd__item" href="/settings">설정</a>
      <button className="dd__item">로그아웃</button>
      </Dropdown>
      <FilePreview/>
    </div>
  );
}

// 인풋
export function FormInput({ textType }) {
  return (
    <div>
      <input className={styles.input} type="text" placeholder={textType} />
    </div>
  );
}

// 밑줄
export function FormUnderline({ textType }) {
  return (
    <div>
      <input className={styles.underline} type="text" placeholder={textType} />
    </div>
  );
}

// 버튼
export function FormBtn({ textType, className }) {
  return (
    <div>
      <button className={className}>{textType}</button>
    </div>
  );
}
// 마이너스 버튼 (파일 삭제)
export function DeleteBtn({onClick}) {
  return (
    <button type="button" onClick={onClick} className={styles.deleteBtn}>
      <span className={styles.delete} />
    </button>
  );
}

// 드롭박스
export function OptionSelect() {
  return (
    <div className={styles.selectWrapper}>
      <select className={styles.select} defaultValue="---- 필수 선택 ----">
        <option>---- 필수 선택 ----</option>
        <option>자료실</option>
        <option>설문 조사</option>
        <option>문의</option>
      </select>
      <div className={styles.selectArrow}></div>
    </div>
  );
}

// 장문 작성
export function TextAreaBox({ textType }) {
  return (
    <div>
      <textarea className={styles.textarea} placeholder={textType} />
    </div>
  );
}

// 체크박스
export function CustomCheckbox({ className }) {
  return (
    <label className={className}>
      <input type="checkbox" />
      <span className={styles.checkmark} />
    </label>
  );
}

// 파일 첨부
export function FileUpload({ files, setFiles }) {
  const inputRef = useRef(null);

  // 파일 추가
  const handleFiles = (fileList) => {
    const newFiles = Array.from(fileList);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    if (e.target.files) {
      handleFiles(e.target.files);
      e.target.value = "";
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div
      className={styles.fileUpload}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      이곳에 파일을 드래그하거나, 클릭하여 <br />
      파일을 첨부하세요
      <input
        ref={inputRef}
        type="file"
        multiple
        style={{ display: "none" }}
        onChange={handleChange}
      />
    </div>
  );
}

// 파일 목록
export function FileList({ files, setFiles }) {
  const removeFile = (idx) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <ul className="addfileList">
      {files.map((file, idx) => (
        <li key={idx}>
          <span>
            {file.name} <DeleteBtn onClick={() => removeFile(idx)} />
          </span>
        </li>
      ))}
    </ul>
  );
}

// 표
export function Table() {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <td>순번</td>
          <td>유형</td>
          <td>사유</td>
          <td>신청일</td>
          <td>승인여부</td>
          <td>첨부파일</td>
        </tr>
      </thead>
      <tbody>
        <tr className={styles.row}>
          <td>1</td>
          <td>외출</td>
          <td>나간다</td>
          <td>2025-09-11</td>
          <td>Y</td>
          <td>📋</td>
        </tr>
      </tbody>
    </table>
  );
}

export default UiComp;

