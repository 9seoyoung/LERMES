// src/routes/AppRoutes.js
import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "../Home";    // 기존 Home 컴포넌트
import About from "../About";  // 기존 About 컴포넌트

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      {/* 404 fallback */}
      <Route path="*" element={<div>404 - 페이지 없음</div>} />
    </Routes>
  );
}

export default AppRoutes;