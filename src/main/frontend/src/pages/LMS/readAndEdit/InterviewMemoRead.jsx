import React from 'react'
import { DateTimeInput, FileList, FormInput } from '../../../components/ui/UiComp';

export function InterviewMemo({
  domFormId, handleChange, formData, files, formId, setFiles,
}) {


  return (
  <>
  <div className='formHeader'>
    <div className='inputSet inputTitleSet'>
      <label className='formLabel' htmlFor={`${domFormId}_itvAplyTtl`}>제목</label>
        <input
          id={`${domFormId}_itvAplyTtl`}
          className='formInput'
          name='itvAplyTtl'
          placeholder='제목을 입력하세요.'
          value={formData.itvAplyTtl}
          onChange={handleChange}
        />
      </div>

      <div className='inputSet inputFlex1'>
          <FormInput type="text" labelNm="작성자" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
          <FormInput type="text" labelNm="담당자" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}></FormInput>
      </div>
    </div>

    <div className="formContent">
          <textarea
              id={`${formId}_itvAplyCn`}
              name="itvAplyCn"
              className='formTextarea'
              placeholder='본문을 입력하세요.'
              value={formData.itvAplyCn}
              onChange={handleChange}>
          </textarea>
          <div className='inputSet'>
        </div>
        <div className='inputSet'>
          <div className='inputSet inputFlex1'>
            <DateTimeInput type="date" labelNm="면담일" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
            <DateTimeInput type="time" labelNm="시간" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></DateTimeInput>
            <FormInput type="text" labelNm="장소" handleChange={handleChange} name="surveyStart" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>
            <FormInput type="text" labelNm="요청사항" handleChange={handleChange} name="surveyEnd" formData={formData} addLabelStyle="formLabel" disabled={true}></FormInput>

          </div>
        </div>
        <div className='inputSet'>
            <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
            <FileList files={files} setFiles={setFiles}></FileList>
        </div>
    </div>
  </>
  );
}