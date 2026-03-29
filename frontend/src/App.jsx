import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./components/Sidebar";
import "./styles/layout.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import DiseaseDetection from "./pages/DiseaseDetection";
import YieldImpact from "./pages/YieldImpact";
import Weather from "./pages/Weather";
import Market from "./pages/MarketPrices";
import Regression from "./pages/Regression";
import TimeSeries from "./pages/TimeSeries";
import Insights from "./pages/Insights";
import Profile from "./pages/Profile";

const isLoggedIn = () => localStorage.getItem("agropestro_user");

function Layout({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="app">
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <div className="main">{children}</div>
    </div>
  );
}

function Protected({ children }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* 🔥 ROOT LOGIC */}
        <Route
          path="/"
          element={
            isLoggedIn()
              ? <Navigate to="/home" replace />
              : <Navigate to="/login" replace />
          }
        />

        {/* LOGIN */}
        <Route path="/login" element={<Login />} />

        {/* PROTECTED */}
        <Route path="/home" element={
          <Protected><Layout><Home /></Layout></Protected>
        } />

        <Route path="/disease" element={
          <Protected><Layout><DiseaseDetection /></Layout></Protected>
        } />

        <Route path="/yield" element={
          <Protected><Layout><YieldImpact /></Layout></Protected>
        } />

        <Route path="/weather" element={
          <Protected><Layout><Weather /></Layout></Protected>
        } />

        <Route path="/market" element={
          <Protected><Layout><Market /></Layout></Protected>
        } />

        <Route path="/regression" element={
          <Protected><Layout><Regression /></Layout></Protected>
        } />

        <Route path="/timeseries" element={
          <Protected><Layout><TimeSeries /></Layout></Protected>
        } />

<Route path="/insights" element={
          <Protected><Layout><Insights /></Layout></Protected>
        } />

<Route path="/profile" element={
          <Protected><Layout><Profile /></Layout></Protected>
        } />

      </Routes>
    </BrowserRouter>
  );
}