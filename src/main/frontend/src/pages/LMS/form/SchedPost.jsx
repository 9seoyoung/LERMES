import { DateTimeInput, FileList, FormInput } from "../../../components/ui/UiComp"

export const SchedPost = ({formId, handleChange, formData, files, setFiles}) => {
  return (
    <>
    <div className='formHeader'>
        <div className='inputSet inputTitleSet'>
          <label className='formLabel' htmlFor={`${formId}_itvAplyTtl`}>제목</label>
          <input
            id={`${formId}_itvAplyTtl`}
            className='formInput'
            name='itvAplyTtl'
            placeholder='제목을 입력하세요.'
            value={formData.itvAplyTtl}
            onChange={handleChange}
          />
        </div>

        <div className='inputSet inputFlex1'>
          <DateTimeInput type="date" labelNm="시작일" handleChange={handleChange} name="author" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}/>
          <DateTimeInput type="date" labelNm="종료일" handleChange={handleChange} name="mento" formData={formData} addLabelStyle="formLabel" addStyle="limitedInput" disabled={true}/>
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
              <FileList files={files} setFiles={setFiles} />
            </div>
    </>
  )
}