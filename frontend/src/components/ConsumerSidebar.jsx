import {
  Home,
  ShoppingCart,
  ShoppingBag,
  User,
  LogOut,
  Grid2X2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

function ConsumerSidebar() {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const menuItems = [
    { title: "Home", icon: <Home size={22} />, path: "/consumer" },
    { title: "Categories", icon: <Grid2X2 size={22} />, path: "/consumer" },
    { title: "Cart", icon: <ShoppingCart size={22} />, path: "/cart" },
    { title: "My Orders", icon: <ShoppingBag size={22} />, path: "/my-orders" },
    { title: "Profile", icon: <User size={22} />, path: "/profile" },
  ];

  return (
    <div
      className={`
        h-screen fixed top-0 left-0 z-50
        bg-gradient-to-b from-[#032b1e] to-[#01140e]
        text-white flex flex-col justify-between
        transition-all duration-300 shadow-2xl
        ${collapsed ? "w-[70px]" : "w-[280px]"}
      `}
    >
      {/* TOP */}
      <div>

        {/* HEADER — always rendered, toggle button always visible */}
        <div className={`flex items-center py-7 ${collapsed ? "justify-center px-2" : "justify-between px-5"}`}>

          {!collapsed && (
            <div>
              <h1 className="text-3xl font-bold">AgroPestro</h1>
              <p className="text-green-200 mt-2 text-lg">Consumer Marketplace</p>
            </div>
          )}

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="bg-[#0b3b2a] p-3 rounded-2xl hover:bg-green-700 transition flex-shrink-0"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>

        </div>

        {/* MENU */}
        <div className={`mt-5 space-y-2 ${collapsed ? "px-2" : "px-4"}`}>
          {menuItems.map((item, index) => (
            <NavLink
              key={index}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center py-4 rounded-2xl transition-all duration-300 text-xl font-medium
                ${collapsed ? "justify-center px-0" : "gap-4 px-5"}
                ${isActive ? "bg-green-100 text-green-900" : "text-gray-200 hover:bg-[#0b3b2a]"}`
              }
            >
              {item.icon}
              {!collapsed && <span>{item.title}</span>}
            </NavLink>
          ))}
        </div>

      </div>

      {/* LOGOUT */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className={`w-full flex items-center py-4 rounded-2xl text-xl font-medium
            text-gray-200 hover:bg-red-500/20 hover:text-red-300 transition
            ${collapsed ? "justify-center px-0" : "gap-4 px-5"}`}
        >
          <LogOut size={22} />
          {!collapsed && "Logout"}
        </button>
      </div>

    </div>
  );
}

export default ConsumerSidebar;