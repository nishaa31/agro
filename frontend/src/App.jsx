import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
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

const isLoggedIn = () => localStorage.getItem("userId");

/* 🔥 MAIN LAYOUT */
function Layout() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="app">
      <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />

      <div
        className="main"
        style={{
          marginLeft: isOpen ? "230px" : "80px",
          transition: "0.3s ease"
        }}
      >
        <Outlet /> {/* 🔥 THIS IS IMPORTANT */}
      </div>
    </div>
  );
}

/* 🔐 PROTECTED ROUTE */
function Protected() {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }
  return <Layout />;
}

/* 🚀 APP */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ROOT */}
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

        {/* 🔥 PROTECTED ROUTES WITH LAYOUT */}
        <Route element={<Protected />}>

          <Route path="/home" element={<Home />} />
          <Route path="/disease" element={<DiseaseDetection />} />
          <Route path="/yield" element={<YieldImpact />} />
          <Route path="/weather" element={<Weather />} />
          <Route path="/market" element={<Market />} />
          <Route path="/regression" element={<Regression />} />
          <Route path="/timeseries" element={<TimeSeries />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/profile" element={<Profile />} />

        </Route>

      </Routes>
    </BrowserRouter>
  );
}