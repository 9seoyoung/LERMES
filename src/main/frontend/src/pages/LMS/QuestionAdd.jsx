import { useEffect, useRef, useState } from "react";
import { QuestionType } from "./QuestionType";

function QuestionAdd() {
    const [questionAmount, setQuestionAmount] = useState([]);
    const addQuestion = () => {
        console.log(questionAmount);
        setQuestionAmount((p) => ([...questionAmount, questionAmount.length]));
    }
    const questionRef = useRef(null);
    // 초기 질문 1개 셋팅
    useEffect(() => {
        setQuestionAmount([0]);
        console.log(questionAmount);
    },[]);

  return (
        <>
            <div>질문추가되는지 확인하는 페이지</div>
            {questionAmount.map((value) => {
                <>
                    <QuestionType key={value} ref={questionRef}/>
                </>
            })}
            <button 
                type="button" 
                className="basicBtn"
                // onClick={() => {
                //     questionAmount.current.push(questionNumber);
                //     questionNumber++;
                //     console.log(questionAmount.current.length);
                //     console.log(questionNumber);
                //     }
                // }
                onClick={addQuestion}
            >
            질문추가
            </button>
            {`현재 문항 수 : ${questionAmount.length}`}
        </>
    )
}

export default QuestionAdd