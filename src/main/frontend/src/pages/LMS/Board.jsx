// 페이지찾기 - 게시판
import { useLocation, useNavigate } from "react-router-dom";
import ListTable from "../../components/ui/ListTable";
import uiStyle from "../../styles/UiComp.module.css"
import { useAccount } from "../../auth/AuthContext";
import { useEffect, useState } from "react";

export default function Board(){
    const navigate = useNavigate();
    const {user} = useAccount();

    return (
        <div className="boardPage">
            <h2>게시판</h2>
            <div className="filterList">
                <ul className="ftList_L">
                    <li>전체</li>
                    <li>공지</li>
                    <li>일정</li>
                    <li>자료실</li>
                    <li>설문</li>
                    <li>FAQ</li>
                    <li>문의</li>
                    <li>면담</li>
                    <li>임시 저장</li>
                </ul>
                <div className="ftList_R">
                    <div className="createBtn " onClick={() => navigate('\createPost')}>
                        + 등록하기
                    </div>
                </div>
            </div>
            <div className="BigListBox">
                <ul className={uiStyle.ListHeader}>
                    <li>순번</li>
                    <li>유형</li>
                    <li>제목</li>
                    <li>작성일</li>
                    <li>작성자</li>
                    <li>조회수</li>
                </ul>
                <ListTable></ListTable>
            </div>
        </div>
    );
}