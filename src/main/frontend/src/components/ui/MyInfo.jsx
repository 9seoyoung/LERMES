import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import "../../styles/dropdown.css";


const MyInfo = forwardRef(function MyInfo(
  {
    trigger = "click", // "click" | "hover" | "both"
    label = "MyInfo",
    children,
    className = "",
    placement = "bottom-end", // "bottom-start" | "bottom-end"
    disabled = false,
  },
  ref
) {
  const [open, setOpen] = useState(false);
  const boxRef = useRef(null);
  const btnRef = useRef(null);
  const hoverTimer = useRef(null);

  // imperative handle
  useImperativeHandle(ref, () => ({
    open: () => setOpen(true),
    close: () => setOpen(false),
    toggle: () => setOpen((v) => !v),
    isOpen: () => open,
  }));

  // 외부 클릭 닫기
  useEffect(() => {
    const onDown = (e) => {
      if (!boxRef.current) return;
      if (!boxRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  // ESC 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // hover 핸들러 (디바운스 느낌으로 부드럽게)
  const startHoverOpen = () => {
    if (trigger === "hover" || trigger === "both") {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setOpen(true), 60);
    }
  };
  const startHoverClose = () => {
    if (trigger === "hover" || trigger === "both") {
      clearTimeout(hoverTimer.current);
      hoverTimer.current = setTimeout(() => setOpen(false), 120);
    }
  };

  const handleButtonClick = () => {
    if (disabled) return;
    if (trigger === "click" || trigger === "both") {
      setOpen((v) => !v);
    }
  };

  // placement 클래스
  const placementClass =
    placement === "bottom-end" ? "dd__menu--end" : "dd__menu--start";

  return (
    <div
      className={`dd ${className}`}
      ref={boxRef}
      onMouseEnter={startHoverOpen}
      onMouseLeave={startHoverClose}
    >
      <button
        ref={btnRef}
        className="joinBtn"
        style={{gap:"8px"}}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={handleButtonClick}
        disabled={disabled}
      >
        <img src={"#"} style={{width: "32px", height: "32px", borderRadius:"50%", display: "flex", alignItems:"center", justifyContent:"center", background:"#f6f6f6"}}>
        
        </img>
        {label}
      </button>

      <div
        className={`dd__menu ${placementClass} ${open ? "is-open" : ""}`}
        role="menu"
      >
        {children}
      </div>
    </div>
  );
});

export default MyInfo;