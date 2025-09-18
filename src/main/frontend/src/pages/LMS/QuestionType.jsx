import { forwardRef, useState } from "react"


export const QuestionType = forwardRef( function QuestionType({key}, ref) {
    const [answerAmount, setAnswerAmount] = useState([]);
    const addAnswer = () => {
        console.log(answerAmount);
        setAnswerAmount((p) => ([...answerAmount, answerAmount.length]));
    }

  return (
    <>
        <div>항목추가는 여기서 부터 -------------------</div>
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
            onClick={addAnswer}
            >
        항목추가
        </button>
    </>
  )
}
)