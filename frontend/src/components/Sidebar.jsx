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
  LogOut,
  Package,
  PlusSquare,
  ShoppingBag,
} from "lucide-react";

import {
  useNavigate,
  useLocation,
} from "react-router-dom";

import { useState } from "react";

function Sidebar() {

  const navigate = useNavigate();

  const location = useLocation();

  const [isOpen, setIsOpen] =
    useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) =>
    location.pathname === path;

  return (

    <div
      style={{

  width: isOpen ? "260px" : "100px",

  minHeight: "100vh",

  overflowY: "auto",

  overflowX: "hidden",

  position: "sticky",

  top: 0,

  flexShrink: 0,

  background:
    "linear-gradient(to bottom,#032b1e,#01140e)",

  color: "#e6e3db",

  transition: "0.3s",

  display: "flex",

  flexDirection: "column",

  justifyContent: "space-between",

  boxShadow:
    "6px 0 30px rgba(0,0,0,0.25)",

  borderRadius: "0 24px 24px 0",

  zIndex: 999,

}}
    >

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div
          style={{

            padding: "20px",

            display: "flex",

            alignItems: "center",

            justifyContent:
              isOpen
                ? "space-between"
                : "center",

          }}
        >

          {isOpen && (

            <div>

              <h2
                style={{
                  fontWeight: "700",
                  fontSize: "30px",
                }}
              >
                Agro
                <span
                  style={{
                    color: "#a8bfa0",
                  }}
                >
                  Pestro
                </span>
              </h2>

            </div>

          )}

          <div
            style={{
              cursor: "pointer",
              background: "#0b3b2a",
              padding: "12px",
              borderRadius: "18px",
            }}

            onClick={toggleSidebar}
          >

            {isOpen
              ? <ChevronLeft />
              : <ChevronRight />}

          </div>

        </div>

        {/* MENU */}
        <div style={{ marginTop: "10px" }}>

          <MenuItem
            icon={<Home />}
            text="Home"
            showText={isOpen}
            active={isActive("/home")}
            onClick={() => navigate("/home")}
          />

          <MenuItem
            icon={<Leaf />}
            text="Disease Detection"
            showText={isOpen}
            active={isActive("/disease")}
            onClick={() => navigate("/disease")}
          />

          <MenuItem
            icon={<Sprout />}
            text="Yield Impact"
            showText={isOpen}
            active={isActive("/yield")}
            onClick={() => navigate("/yield")}
          />

          <MenuItem
            icon={<BarChart3 />}
            text="Insights"
            showText={isOpen}
            active={isActive("/insights")}
            onClick={() => navigate("/insights")}
          />

          <MenuItem
            icon={<BarChart2 />}
            text="Regression"
            showText={isOpen}
            active={isActive("/regression")}
            onClick={() => navigate("/regression")}
          />

          <MenuItem
            icon={<Clock />}
            text="Time Series"
            showText={isOpen}
            active={isActive("/timeseries")}
            onClick={() => navigate("/timeseries")}
          />

          <MenuItem
            icon={<Package />}
            text="My Products"
            showText={isOpen}
            active={isActive("/my-products")}
            onClick={() => navigate("/my-products")}
          />

          <MenuItem
            icon={<PlusSquare />}
            text="Add Products"
            showText={isOpen}
            active={isActive("/add-products")}
            onClick={() => navigate("/add-products")}
          />

          <MenuItem
            icon={<ShoppingBag />}
            text="Orders"
            showText={isOpen}
            active={isActive("/orders")}
            onClick={() => navigate("/orders")}
          />

        </div>

      </div>

      {/* BOTTOM */}
      <div style={{ marginBottom: "20px" }}>

        <MenuItem
          icon={<User />}
          text="Profile"
          showText={isOpen}
          onClick={() => navigate("/profile")}
        />

        <MenuItem

          icon={<LogOut />}

          text="Logout"

          showText={isOpen}

          onClick={() => {

            localStorage.clear();

            navigate("/login");

          }}
        />

      </div>

    </div>
  );
}

function MenuItem({
  icon,
  text,
  onClick,
  active,
  showText,
}) {

  return (

    <div
      onClick={onClick}

      style={{

        margin: "8px 12px",

        padding: showText
  ? "16px"
  : "16px 0",

        display: "flex",

        alignItems: "center",

        justifyContent:
          showText
            ? "flex-start"
            : "center",

        gap: showText ? "14px" : "0px",

        cursor: "pointer",

        borderRadius: "18px",

        transition: "0.3s",

        background:

          active
            ? "#d7f0dc"
            : "transparent",

        color:

          active
            ? "#0b1f1a"
            : "#e6e3db",

        fontSize: "16px",

        fontWeight: "500",

      }}
    >

      {icon}

      {showText && text}

    </div>
  );
}

export default Sidebar;