import SurveyModel from "../../../utils/SurveyModel";


function SurveyPost({domFormId, handleChange, formData, FileList, files, setFiles, surveyForm, setSurveyForm, postId}) {



  return (
    <>
      <div className='formHeader'>
        <div className='inputSet'>
          <label className='formLabel' htmlFor={`${domFormId}_title`}>제목</label>
          <input id={`${domFormId}_title`}
            className='formInput' 
            name='title' 
            placeholder='제목을 입력하세요.' 
            value={formData.title} 
            onChange={handleChange}
          />
        </div>
        <div className='inputSet inputFlex1'>
          <label className='formLabel' htmlFor={`${domFormId}_surveyPeriod`}>모집기간</label>
          <input id={`${domFormId}_surveyStart`}
            type="date"
            className='formInput' 
            name='surveyStart' 
            value={formData.surveyStart} 
            onChange={handleChange}
          />
          <p>-</p>
          <input id={`${domFormId}_surveyEnd`}
            type="date"
            className='formInput' 
            name='surveyEnd' 
            value={formData.surveyEnd} 
            onChange={handleChange}
          />
        </div>
      </div>
      <div className="formContent">
      {/* 본문 - 설문 에디터 */}
      <SurveyModel
        postId={postId}
        domFormId={domFormId}
        surveyForm={surveyForm}
        setSurveyForm={setSurveyForm}
        files={files}             
        setFiles={setFiles}        
      />
      </div>

      {/* 첨부파일 리스트 */}
      <div className='inputSet'>
        <label className='formLabel' htmlFor={`${domFormId}_file`}>파일</label>
        <FileList files={files} setFiles={setFiles} />
      </div>
    </>
  )
}

export default SurveyPost