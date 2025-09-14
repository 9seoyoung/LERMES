import { useNavigate } from "react-router-dom";
import Dropdown from "../Dropdown";

import layoutStyles from "../../../styles/layout.module.css"


function SuperHeader() {
  const navigate = useNavigate();

  return (
    <div className="header_L" >
      <button>
        <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
      </button>
      <div className={layoutStyles.menuContainer}>
        {/* <ul>
          <li> */}
            {/* <div className={layoutStyles.subMenuName} onClick={() => setToggle1(!menuToggle1)}>비즈니스: 더 알아보기
              {menuToggle1 === true ? <div>▲</div> : <div>▼</div>}
            </div> */}
            <Dropdown label="비즈니스: 더 알아보기" trigger="hover" placement="bottom-start">
              <div className={layoutStyles.subMenuList}>메뉴 1</div>
              <div className={layoutStyles.subMenuList}>메뉴 2</div>
              <div className={layoutStyles.subMenuList}>메뉴 3</div>
              <div className={layoutStyles.subMenuList}>메뉴 4</div>
            </Dropdown>
          {/* </li>
        </ul> */}
        {/* <ul>
          <li> */}
            <Dropdown label="비즈니스/제휴" trigger="hover" placement="bottom-start">
              <div className={layoutStyles.subMenuList}>메뉴 1</div>
              <div className={layoutStyles.subMenuList}>메뉴 2</div>
              <div className={layoutStyles.subMenuList}>메뉴 3</div>
              <div className={layoutStyles.subMenuList} onClick={()=> navigate('/welcome/tenantjoin')}>비즈니스 가입</div>
            </Dropdown>
          {/* </li>
        </ul> */}
      </div>
    </div>
    
  )
}

export default SuperHeader