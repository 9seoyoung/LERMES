import React, { useEffect, useId, useState, useRef } from 'react'
import Dropdown from '../../../components/ui/Dropdown'
import layoutStyles from "../../../styles/layout.module.css"
import {FileUpload, FileList } from '../../../components/ui/UiComp';
import { useAccount } from '../../../auth/AuthContext';
import { ArticlePost } from './ArticlePost';
import { hortlistByCpSn } from "../../../services/cohortService";
import SurveyPost from './SurveyPost';
import {v4 as uuidv4} from "uuid";
import QuestionAdd from './QuestionAdd';

// CreatePost.jsx
// ...import 생략

function CreatePost() {
  const domFormId = useId();
  const postId = useRef(uuidv4());
  const { user } = useAccount();
  const coSn = user.USER_OGDP_CO_SN;
  const userAuth = user.USER_AUTHRT_SN;

  const [hortlist, setHortList] = useState([]);
  const [files, setFiles] = useState([]);

  // 설문 폼 (초기 페이지 하나 생성)
  const [surveyForm, setSurveyForm] = useState({
    id: postId.current,
    pages: [{ id: uuidv4(), questions: [] }],
  });

  // 일반 게시글
  const [formData, setFormData] = useState({
    id: postId.current,
    username: "",
    email: "",
    title: "",
    content: "",
    type: "",
    scope: "",
    detailScope: "",
    surveyStart: "",     // ☆ 추가
    surveyEnd: "",       // ☆ 추가
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const tempSubmit = () => {};
  const saveSubmit = () => {};

  useEffect(() => {
    (async () => {
      try {
        const data = await hortlistByCpSn(coSn);
        setHortList(data.data);
      } catch (e) {
        console.log(e.message);
      }
    })();
  }, [coSn]);

  function PostStatus({ type }) {
    switch (type) {
      case "공지사항":
      case "자료실":
      case "학습일지":
      case "FAQ":
        return (
          <ArticlePost
            postId={postId.current}
            domFormId={domFormId}
            handleChange={handleChange}
            formData={formData}
            FileList={FileList}
            files={files}
            setFiles={setFiles}
          />
        );
      case "설문조사":
        return (
          <SurveyPost
            postId={postId.current}
            domFormId={domFormId}
            handleChange={handleChange}
            formData={formData}
            surveyForm={surveyForm}
            setSurveyForm={setSurveyForm}
            FileList={FileList}
            files={files}
            setFiles={setFiles}
          />
        );
      default:
        return (
          <ArticlePost
            postId={postId.current}
            domFormId={domFormId}
            handleChange={handleChange}
            formData={formData}
            FileList={FileList}
            files={files}
            setFiles={setFiles}
          />
        );
    }
  }

  return (
    <div className="boardPage">
      <h2>게시판</h2>
      <div className="BigListBox">
        <h4 style={{ fontWeight: "500" }}>{formData.type} 등록하기</h4>

        <form className="formAreaRow" onSubmit={(e) => e.preventDefault()}>
          <div className="formArea_L">
            <PostStatus type={formData.type} />
          </div>

          <div className="formArea_R">
            <div className="selectBoxArea" style={{ position: "relative" }}>
              <div className="dropSet" style={{ zIndex: "4" }}>
                <p>유형</p>
                <Dropdown className="dropset_dd" label={formData.type || "---- 필수 선택 ----"}>
                  {userAuth === 2 || userAuth === 3}
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "공지사항" }))}>공지사항</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "자료실" }))}>자료실</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "설문조사" }))}>설문조사</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "FAQ" }))}>FAQ</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "일정" }))}>일정</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담기록" }))}>면담기록</p>
                  {(userAuth === 4 || userAuth === 5) ? (
                    <>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "학습일지" }))}>학습일지</p>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "문의" }))}>문의</p>
                      <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, type: "면담신청" }))}>면담신청</p>
                    </>
                  ) : ""}
                </Dropdown>
                <input type="hidden" name="type" value={formData.type} />
              </div>

              <div className="dropSet" style={{ zIndex: "2" }}>
                <p>공개 범위</p>
                <Dropdown className="dropset_dd" label={formData.scope || "---- 필수 선택 ----"}>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "전체" }))}>전체</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "소속그룹" }))}>소속그룹</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "관리자" }))}>관리자</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "강사" }))}>강사</p>
                  <p className={layoutStyles.subMenuList} onClick={() => setFormData(s => ({ ...s, scope: "비공개" }))}>비공개</p>
                </Dropdown>
                <input type="hidden" name="scope" value={formData.scope} />
              </div>

              {formData.scope === "소속그룹" && (
                <div className="dropSet" style={{ zIndex: "1" }}>
                  <p>하위 그룹</p>
                  <Dropdown className="dropset_dd" label={formData.detailScope || "---- 필수 선택 ----"}>
                    {hortlist.map((h, idx) => (
                      <p
                        className={layoutStyles.subMenuList}
                        key={idx}
                        onClick={() => setFormData(s => ({ ...s, detailScope: String(h.cohortNm) }))}
                      >
                        {h.cohortNm}
                      </p>
                    ))}
                  </Dropdown>
                  <input type="hidden" name="detailScope" value={formData.detailScope} />
                </div>
              )}
            </div>

            <div className="r_bottom">
              <FileUpload files={files} setFiles={setFiles} />
              <div className="save_box">
                <button className="basicBtn tempBtn" type="button" onClick={tempSubmit}>임시 저장</button>
                <button className="basicBtn saveBtn" type="button" onClick={saveSubmit}>저장</button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;