import { Navigate } from "react-router-dom"
import layoutStyles from "../../../styles/layout.module.css"

function SuperHeader() {
  return (
    <div className="header_L" >
      <button>
        <img src={process.env.PUBLIC_URL + '/img/logo.png'} alt="Logo" />
      </button>
      <div className={layoutStyles.menuContainer}>
        <ul>
          <li>비즈니스: 더 알아보기
            <ul>
              <li>메뉴 1</li>
              <li>메뉴 2</li>
              <li>메뉴 3</li>
              <li>메뉴 4</li>
            </ul>
          </li>
        </ul>
        <ul>
          <li>비즈니스/제휴
            <ul>
              <li>메뉴 1</li>
              <li>메뉴 2</li>
              <li>메뉴 3</li>
              <li>메뉴 4</li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
    
  )
}

export default SuperHeader