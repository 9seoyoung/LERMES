import layoutStyles from "../../../styles/layout.module.css"
import { useState } from "react"

function SuperHeader() {
  const [menuToggle1, setToggle1] = useState(false);
  const [menuToggle2, setToggle2] = useState(false);
  const hoverOn = "display: block";
  const hoverOff = "display: hidden"  ;

  return (
    <div className="header_L" >
      <button>
        <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
      </button>
      <div className={layoutStyles.menuContainer}>
        <ul>
          <li>
            <div className={layoutStyles.subMenuName} onClick={() => setToggle1(!menuToggle1)}>비즈니스: 더 알아보기
              {menuToggle1 === true ? <span>▲</span> : <span>▼</span>}
            </div>
            <ul style={{ display: menuToggle1 ? "block" : "none" }} onClick={() => setToggle1(false)}>
              <li className={layoutStyles.subMenuList}>메뉴 1</li>
              <li className={layoutStyles.subMenuList}>메뉴 2</li>
              <li className={layoutStyles.subMenuList}>메뉴 3</li>
              <li className={layoutStyles.subMenuList}>메뉴 4</li>
            </ul>
          </li>
        </ul>
        <ul>
          <li>
            <div className={layoutStyles.subMenuName} onClick={() => setToggle2(!menuToggle2)}>비즈니스/제휴
              {menuToggle2 === true ? <span>▲</span> : <span>▼</span> }
            </div>
            <ul style={{ display: menuToggle2 ? "block" : "none" }} onClick={() => setToggle2(false)}>
              <li className={layoutStyles.subMenuList}>메뉴 1</li>
              <li className={layoutStyles.subMenuList}>메뉴 2</li>
              <li className={layoutStyles.subMenuList}>메뉴 3</li>
              <li className={layoutStyles.subMenuList}>메뉴 4</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    
  )
}

export default SuperHeader