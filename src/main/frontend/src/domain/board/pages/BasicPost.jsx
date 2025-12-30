import React from 'react'
import { GrayBtn } from '../../../components/ui/UiComp';
import { useNavigate } from 'react-router-dom';
import BasicFormOption from '../components/FormOption';

function BasicPost({formData}) {
  const navigate = useNavigate();
  

  return (
    <>
      <div className='boardPage'>
        <div className='limitedHeightBox'>
          <h4>{formData?.type} 등록하기 <GrayBtn textType={"← back"} onClick={(e) => {e.preventDefault(); navigate(-1);}}></GrayBtn>
          </h4>
          <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
            <div className="formArea_L">
              글 종류에 따라 바뀌는 구간 (내용)
            </div>
            <BasicFormOption />
          </form>
        </div>
        <div>장외</div>
      </div>
    </>
  )
}

export default BasicPost