import React from "react";
import { Routes, Route } from "react-router-dom";

import Header from "./components/header";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Chatbot from "./components/chatbot";      // <- ensure filename/case matches
import DiseaseDetection from "./pages/DiseaseDetection";
import Marketplace from "./pages/Marketplace";

const App: React.FC = () => {
  return (
    <>
      {/* visible on all routes */}
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/disease" element={<DiseaseDetection />} />
        <Route path="/marketplace" element={<Marketplace />} />
      </Routes>

      {/* floating widget visible on all routes */}
      <Chatbot />
    </>
  );
};

export default App;
