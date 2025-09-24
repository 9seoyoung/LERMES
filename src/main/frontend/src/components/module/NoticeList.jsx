import React from 'react';
import ListTable from '../ui/ListTable';

function NoticeList() {
  return (
    <>
        <h4>공지사항<div className="specificBtn">+ 더보기</div></h4>
        <div className='tableBox'>
            <ListTable
                columnData={["a", "b", "c"]}
                apiData={[{a: "구서영", b: "김진령", c: "최인호"}, {a: "구서영", b: "김진령", c: "최인호"}, {a: "구서영", b: "김진령", c: "최인호"}, {a: "구서영", b: "김진령", c: "최인호"}, {a: "구서영", b: "김진령", c: "최인호"}]}
            />
        </div>
    </>
  )
}

export default NoticeList;
