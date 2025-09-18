

function SurveyPost({formId, handleChange, formData, FileList, files, setFiles}) {
  return (
    <>
      <div className='formHeader'>
        <div className='inputSet'>
          <label className='formLabel' htmlFor={`${formId}_title`}>제목</label>
          <input id={`${formId}_title`}
            className='formInput' 
            name='title' 
            placeholder='제목을 입력하세요.' 
            value={formData.title} 
            onChange={handleChange}
          />
        </div>
        <div className='inputSet inputFlex1'>
          <label className='formLabel' htmlFor={`${formId}_surveyPeriod`}>모집기간</label>
          <input id={`${formId}_surveyStart`}
            type="date"
            className='formInput' 
            name='surveyStart' 
            value={formData.surveyStart} 
            onChange={handleChange}
          />
          <p>-</p>
          <input id={`${formId}_surveyEnd`}
            type="date"
            className='formInput' 
            name='surveyEnd' 
            value={formData.surveyEnd} 
            onChange={handleChange}
          />
        </div>
      </div>
      {/* 본문 */}
      <textarea                 
          id={`${formId}_content`}
          name="content"
          className='formTextarea'
          placeholder='본문을 입력하세요.'
          value={formData.content}
          onChange={handleChange}>
      </textarea>
      <div className='inputSet'>
        <label className='formLabel' htmlFor={`${formId}_file`}>파일</label>
        <FileList files={files} setFiles={setFiles}></FileList>
      </div>
    </>
  )
}

export default SurveyPost