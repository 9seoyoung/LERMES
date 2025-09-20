// SurveyPost.jsx
import QuestionAdd from "./QuestionAdd"; // 위에서 export default로 바꿨으므로 경로/이름 확인

function SurveyPost({
  domFormId, handleChange, formData,
  FileList, files, setFiles,
  surveyForm, setSurveyForm, postId
}) {
  // pages[0]이 항상 존재하도록 보장(상위 CreatePost에서 초기화함)
  const firstPage = surveyForm.pages[0];

  return (
    <>
      <div className='formHeader'>
        <div className='inputSet'>
          <label className='formLabel' htmlFor={`${domFormId}_title`}>제목</label>
          <input
            id={`${domFormId}_title`}
            className='formInput'
            name='title'
            placeholder='제목을 입력하세요.'
            value={formData.title}
            onChange={handleChange}
          />
        </div>

        <div className='inputSet inputFlex1'>
          <label className='formLabel' htmlFor={`${domFormId}_surveyPeriod`}>모집기간</label>
          <input
            id={`${domFormId}_surveyStart`}
            type="date"
            className='formInput'
            name='surveyStart'
            value={formData.surveyStart || ""}
            onChange={handleChange}
          />
          <p>-</p>
          <input
            id={`${domFormId}_surveyEnd`}
            type="date"
            className='formInput'
            name='surveyEnd'
            value={formData.surveyEnd || ""}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="formContent">
        {/* ☆ 초기 질문 주입 + 변경시 surveyForm 갱신 */}
        <QuestionAdd
          initialQuestions={firstPage.questions}
          onChange={(qs) => {
            setSurveyForm(prev => ({
              ...prev,
              pages: [
                { ...prev.pages[0], questions: qs },
                ...prev.pages.slice(1),
              ],
            }));
          }}
        />
      </div>

      {/* 첨부파일 리스트 */}
      <div className='inputSet'>
        <label className='formLabel' htmlFor={`${domFormId}_file`}>파일</label>
        <FileList files={files} setFiles={setFiles}></FileList>
      </div>
    </>
  );
}

export default SurveyPost;