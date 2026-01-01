import { Plus } from "lucide-react";
import { useState } from "react"


function GridLayout() {
  const [openToggle, setOpenToggle] = useState(true);

  return (
      <div className={`layoutFrame ${openToggle ? "isClosed" : ""}`}>
        <header className="header">
          <div onClick={() => setOpenToggle(!openToggle)}><Plus></Plus></div>
        </header>
        <aside className={`aside ${openToggle ? "isClosed" : ""}`}>
          와 이렇게 쉬웠다고?~~~~~~~~~~~~~~~~~~~~₩
        </aside>
        <main className="main">본문영역임</main>
        <footer className="footer">푸터영역임</footer>
      </div>
  )
}

export default GridLayout