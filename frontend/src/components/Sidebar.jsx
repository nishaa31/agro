import {
  Home,
  BarChart2,
  BarChart3,
  Clock,
  ChevronLeft,
  ChevronRight,
  Leaf,
  Sprout,
  User,
  LogOut
} from "lucide-react";

import { useNavigate, useLocation } from "react-router-dom";

function Sidebar({ isOpen, toggleSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div
      style={{
        width: isOpen ? "230px" : "80px",
        height: "100vh",
        position: "fixed",
        left: 0,
        top: 0,
        backgroundColor: "#0b1f1a",
        color: "#e6e3db",
        transition: "0.3s",
        display: "flex",
        flexDirection: "column",
        boxShadow: "6px 0 30px rgba(0,0,0,0.25)",
        borderRadius: "0 24px 24px 0",
      }}
    >
      {/* LOGO */}
      <div
        style={{
          padding: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: isOpen ? "space-between" : "center",
        }}
      >
        {isOpen && (
          <h2 style={{ fontWeight: "700" }}>
            Agro<span style={{ color: "#a8bfa0" }}>Pesto</span>
          </h2>
        )}

        <div style={{ cursor: "pointer" }} onClick={toggleSidebar}>
          {isOpen ? <ChevronLeft /> : <ChevronRight />}
        </div>
      </div>

      {/* 🔥 TOP MENU */}
      <div style={{ flex: 1 }}>
        <MenuItem icon={<Home />} text="Home" showText={isOpen} active={isActive("/home")} onClick={() => navigate("/home")} />
        <MenuItem icon={<Leaf />} text="Disease Detection" showText={isOpen} active={isActive("/disease")} onClick={() => navigate("/disease")} />
        <MenuItem icon={<Sprout />} text="Yield Impact" showText={isOpen} active={isActive("/yield")} onClick={() => navigate("/yield")} />
        <MenuItem icon={<BarChart3 />} text="Insights" showText={isOpen} active={isActive("/insights")} onClick={() => navigate("/insights")} />
        <MenuItem icon={<BarChart2 />} text="Regression" showText={isOpen} active={isActive("/regression")} onClick={() => navigate("/regression")} />
        <MenuItem icon={<Clock />} text="Time Series" showText={isOpen} active={isActive("/timeseries")} onClick={() => navigate("/timeseries")} />
      </div>

      {/* 🔥 BOTTOM MENU */}
      <div style={{ marginBottom: "20px" }}>
        <MenuItem icon={<User />} text="Profile" showText={isOpen} onClick={() => navigate("/profile")} />
        <MenuItem
          icon={<LogOut />}
          text="Logout"
          showText={isOpen}
          onClick={() => {
            localStorage.removeItem("agropestro_user");
            navigate("/login");
          }}
        />
      </div>

    </div>
  );
}

function MenuItem({ icon, text, onClick, active, showText }) {
  return (
    <div
      onClick={onClick}
      style={{
        margin: "6px 12px",
        padding: "14px",
        display: "flex",
        alignItems: "center",
        gap: "14px",
        cursor: "pointer",
        borderRadius: "14px",
        background: active
          ? "linear-gradient(90deg,#a8bfa0,#6f8f7a)"
          : "transparent",
        color: active ? "#0b1f1a" : "#e6e3db",
      }}
    >
      {icon}
      {showText && text}
    </div>
  );
}

export default Sidebar;