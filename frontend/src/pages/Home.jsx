import {
  Menu,
  Search,
  Bell,
  ChevronDown,
  Sprout,
  Activity,
  Wheat,
  BarChart3,
  Clock3,
  ArrowRight,
  ScanLine,
  X,
  User,
  Settings,
  BellRing,
  Shield,
  Palette,
} from "lucide-react";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [search, setSearch] = useState("");
  const [openProfile, setOpenProfile] = useState(false);

  const navigate = useNavigate();

  const [profileData, setProfileData] = useState({
  name: localStorage.getItem("username") || "User",
  phone: localStorage.getItem("phone") || "",
  location: localStorage.getItem("location") || "",
  email: localStorage.getItem("email") || "",
});

useEffect(() => {
  const fetchProfile = async () => {
    const userId = localStorage.getItem("userId");

    if (!userId) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/profile/${userId}`);
      const data = await res.json();

      setProfileData({
        name: data.name || "User",
        phone: data.phone || "",
        location: data.location || "",
        email: data.email || "",
      });

      localStorage.setItem("username", data.name || "User");
      localStorage.setItem("phone", data.phone || "");
      localStorage.setItem("location", data.location || "");
      localStorage.setItem("email", data.email || "");

    } catch (err) {
      console.log(err);
    }
  };

  fetchProfile();
}, []);

  const [openProfileModal, setOpenProfileModal] =
  useState(false);

const [openSettingsModal, setOpenSettingsModal] =
  useState(false);

const [activeTab, setActiveTab] =
  useState("General");

  // LOGOUT
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // STATS
  const stats = [
    {
      title: "Total Predictions",
      value: "1,248",
      growth: "↑ 18% this month",
      icon: <Sprout size={24} />,
      bg: "bg-green-100",
      text: "text-green-700",
    },
    {
      title: "Diseases Detected",
      value: "15",
      growth: "↑ 6 new this month",
      icon: <Activity size={24} />,
      bg: "bg-violet-100",
      text: "text-violet-700",
    },
    {
      title: "Yield Reports",
      value: "320",
      growth: "↑ 12% this month",
      icon: <Wheat size={24} />,
      bg: "bg-yellow-100",
      text: "text-yellow-700",
    },
    {
      title: "Model Accuracy",
      value: "96%",
      growth: "↑ 4% improved",
      icon: <BarChart3 size={24} />,
      bg: "bg-blue-100",
      text: "text-blue-700",
    },
  ];

  // MODULES
  const modules = [
    {
      title: "Disease Detection",
      desc: "Upload leaf image and detect diseases using AI model.",
      icon: <ScanLine size={30} />,
      bg: "bg-green-50",
      iconBg: "bg-green-100",
      iconText: "text-green-700",
      route: "/disease",
    },

    {
      title: "Yield Prediction",
      desc: "Predict crop yield using environmental factors.",
      icon: <BarChart3 size={30} />,
      bg: "bg-blue-50",
      iconBg: "bg-blue-100",
      iconText: "text-blue-700",
      route: "/yield",
    },

    {
      title: "Time Series Forecast",
      desc: "Forecast future crop yield using time-series analysis.",
      icon: <Clock3 size={30} />,
      bg: "bg-orange-50",
      iconBg: "bg-orange-100",
      iconText: "text-orange-700",
      route: "/timeseries",
    },
  ];

  // ACTIVITIES
  const activities = [
    {
      title: "Disease Detection",
      desc: "Stripe Rust detected",
      icon: "🌱",
      time: "2 mins ago",
      bg: "bg-green-50",
    },

    {
      title: "Yield Prediction",
      desc: "Yield loss predicted",
      icon: "📉",
      time: "10 mins ago",
      bg: "bg-orange-50",
    },

    {
      title: "Forecast Generated",
      desc: "Time series completed",
      icon: "📈",
      time: "30 mins ago",
      bg: "bg-blue-50",
    },
  ];

  // PROFILE MENU
  const profileMenu = [
    {
      title: "My Profile",
      desc: "View and edit profile",
      icon: "👤",
      action: () => {
      setOpenProfileModal(true);
      setOpenProfile(false);
      },
    },

    {
      title: "Settings",
      desc: "Preferences & account",
      icon: "⚙️",
      action: () => {
      setOpenSettingsModal(true);
      setOpenProfile(false);
    },
    },

    {
      title: "Activity",
      desc: "Recent activities",
      icon: "🕘",
      action: () => {
      navigate("/insights");
      setOpenProfile(false);
      },
    },
  ];

  const handleSaveProfile = async () => {
  try {
    const userId = localStorage.getItem("userId");

    const res = await fetch(
      `http://127.0.0.1:8000/profile/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profileData),
      }
    );

    const data = await res.json();

    localStorage.setItem("username", profileData.name);
    localStorage.setItem("phone", profileData.phone);
    localStorage.setItem("location", profileData.location);
    localStorage.setItem("email", profileData.email);

    alert("Profile updated successfully 🔥");

    setOpenProfileModal(false);
  } catch (err) {
    console.log(err);
  }
};

  return (
    <div className="min-h-screen bg-[#f4f7f2] p-6">
      {/* TOPBAR */}
      <div className="flex flex-col gap-4 rounded-[28px] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <button className="rounded-xl bg-gray-100 p-3">
            <Menu size={22} />
          </button>

          <h1 className="text-3xl font-bold text-gray-800">
            Home
          </h1>
        </div>

        {/* SEARCH */}
        <div className="flex flex-1 items-center justify-center">
          <div className="flex w-full max-w-xl items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3">
            <Search className="text-gray-500" size={20} />

            <input
              type="text"
              placeholder="Search anything..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent outline-none"
            />
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-5">
          {/* NOTIFICATION */}
          <button className="relative rounded-xl bg-gray-100 p-3">
            <Bell size={20} />

            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
              3
            </span>
          </button>

          {/* PROFILE */}
          <div className="relative">
            <button
              onClick={() =>
                setOpenProfile(!openProfile)
              }
              className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2 transition-all hover:bg-gray-100"
            >
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="h-12 w-12 rounded-full object-cover"
              />

              <div className="text-left">
                <h2 className="font-semibold text-gray-800">
                  {profileData.name || "User"}
                </h2>

                <p className="text-sm text-gray-500">
                  Admin
                </p>
              </div>

              <ChevronDown
                size={18}
                className={`transition-all duration-300 ${
                  openProfile ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* DROPDOWN */}
            {openProfile && (
              <div className="absolute right-0 top-16 z-50 w-[320px] rounded-[28px] border border-gray-100 bg-white p-3 shadow-2xl">
                {/* MENU */}
                <div className="space-y-2">
                  {profileMenu.map((item, index) => (
                    <button
                      key={index}
                      onClick={item.action}
                      className="flex w-full items-start gap-4 rounded-2xl p-4 transition-all hover:bg-gray-50"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-100 text-xl">
                        {item.icon}
                      </div>

                      <div className="text-left">
                        <h2 className="font-semibold text-gray-800">
                          {item.title}
                        </h2>

                        <p className="text-sm text-gray-500">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>

                {/* DIVIDER */}
                <div className="my-3 border-t border-gray-100" />

                {/* LOGOUT */}
                <button
                  onClick={handleLogout}
                  className="flex w-full items-start gap-4 rounded-2xl p-4 text-red-600 transition-all hover:bg-red-50"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-100 text-xl">
                    🚪
                  </div>

                  <div className="text-left">
                    <h2 className="font-semibold">
                      Logout
                    </h2>

                    <p className="text-sm text-red-400">
                      Sign out from account
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <div className="mt-6 grid gap-6 rounded-[35px] bg-white p-6 shadow-sm lg:grid-cols-2">
        {/* LEFT */}
        <div className="flex flex-col justify-center">
          <div className="mb-5 inline-flex w-fit items-center gap-2 rounded-full bg-green-100 px-4 py-2 text-green-700">
            🌱 AI Powered Agriculture
          </div>

          <h1 className="text-5xl font-bold leading-tight text-gray-900">
            AI Powered Smart Agriculture
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-600">
            Predict crop yield, detect diseases and get
            actionable insights to make better farming
            decisions.
          </p>

          {/* BUTTONS */}
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={() => navigate("/disease")}
              className="flex items-center gap-2 rounded-2xl bg-green-700 px-6 py-4 font-semibold text-white transition-all hover:scale-105"
            >
              Start Prediction
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => navigate("/insights")}
              className="rounded-2xl border border-green-700 px-6 py-4 font-semibold text-green-700 transition-all hover:bg-green-50"
            >
              Explore Insights
            </button>
          </div>

          {/* USERS */}
          <div className="mt-10 flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                className="h-12 w-12 rounded-full border-4 border-white"
                src="https://i.pravatar.cc/101"
              />

              <img
                className="h-12 w-12 rounded-full border-4 border-white"
                src="https://i.pravatar.cc/102"
              />

              <img
                className="h-12 w-12 rounded-full border-4 border-white"
                src="https://i.pravatar.cc/103"
              />
            </div>

            <div>
              <h2 className="font-bold text-gray-800">
                Trusted by 2000+ farmers
              </h2>

              <p className="text-gray-500">
                Across multiple regions
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className="relative overflow-hidden rounded-[30px]">
          <img
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1600&auto=format&fit=crop"
            alt=""
            className="h-full w-full object-cover"
          />

          {/* FLOATING CARD */}
          <div className="absolute bottom-6 right-6 rounded-[24px] bg-white/90 p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 p-4 text-green-700">
                <BarChart3 size={28} />
              </div>

              <div>
                <p className="text-sm text-gray-500">
                  Model Accuracy
                </p>

                <h2 className="text-4xl font-bold text-gray-800">
                  96%
                </h2>
              </div>
            </div>

            <div className="mt-5 h-2 w-full rounded-full bg-gray-200">
              <div className="h-2 w-[96%] rounded-full bg-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item, index) => (
          <div
            key={index}
            className="rounded-[28px] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:ring-2 hover:ring-green-100"
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.bg} ${item.text}`}
            >
              {item.icon}
            </div>

            <h3 className="mt-5 text-gray-500">
              {item.title}
            </h3>

            <h2 className="mt-2 text-4xl font-bold text-gray-800">
              {item.value}
            </h2>

            <p className="mt-2 text-sm text-green-600">
              {item.growth}
            </p>
          </div>
        ))}
      </div>

      {/* MODULES */}
      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {modules.map((item, index) => (
          <div
            key={index}
            onClick={() => navigate(item.route)}
            className={`cursor-pointer rounded-[30px] p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:ring-2 hover:ring-green-100 ${item.bg}`}
          >
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${item.iconBg} ${item.iconText}`}
            >
              {item.icon}
            </div>

            <h2 className="mt-6 text-3xl font-bold text-gray-800">
              {item.title}
            </h2>

            <p className="mt-4 leading-relaxed text-gray-600">
              {item.desc}
            </p>

            <button className="mt-6 flex items-center gap-2 font-semibold text-green-700 transition-all hover:gap-3">
              Learn More
              <ArrowRight size={18} />
            </button>
          </div>
        ))}
      </div>

      {/* PROFILE MODAL */}
{openProfileModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative w-full max-w-2xl rounded-[32px] bg-white p-8 shadow-2xl">
      {/* CLOSE */}
      <button
        onClick={() => setOpenProfileModal(false)}
        className="absolute right-5 top-5 rounded-xl bg-gray-100 p-3 transition-all hover:bg-gray-200"
      >
        <X size={20} />
      </button>

      {/* HEADER */}
      <div className="flex items-center gap-5">
        <img
          src="https://i.pravatar.cc/120"
          alt=""
          className="h-28 w-28 rounded-full object-cover"
        />

        <div>
          <h1 className="text-4xl font-bold text-gray-800">
            {profileData.name || "User"}
          </h1>

          <p className="mt-2 text-gray-500">
            AI Agriculture Dashboard User
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Username
          </label>

          <input
            type="text"
            defaultValue={profileData.name}
onChange={(e) =>
  setProfileData({ ...profileData, name: e.target.value })
}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Email
          </label>

          <input
            type="email"
            value={profileData.email}
onChange={(e) =>
  setProfileData({ ...profileData, email: e.target.value })
}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Phone
          </label>

          <input
            type="text"
            value={profileData.phone}
onChange={(e) =>
  setProfileData({ ...profileData, phone: e.target.value })
}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
          />
        </div>

        <div>
          <label className="mb-2 block font-semibold text-gray-700">
            Location
          </label>

          <input
            type="text"
            value={profileData.location}
onChange={(e) =>
  setProfileData({ ...profileData, location: e.target.value })
}
            className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
          />
        </div>
      </div>

      {/* BUTTON */}
      <button onClick={handleSaveProfile}>
  Save Changes
</button>
    </div>
  </div>
)}

      {/* RECENT ACTIVITIES */}
      <div className="mt-8 rounded-[32px] bg-white p-6 shadow-sm">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Recent Activities
            </h1>

            <p className="mt-1 text-gray-500">
              Latest AI prediction activities
            </p>
          </div>

          <button
            onClick={() => navigate("/insights")}
            className="rounded-2xl border border-gray-200 px-5 py-3 font-medium text-gray-700 transition-all hover:bg-gray-50"
          >
            View All
          </button>
        </div>

        {/* ACTIVITY CARDS */}
        <div className="grid gap-5 md:grid-cols-3">
          {activities.map((item, index) => (
            <div
              key={index}
              className={`rounded-[28px] p-5 transition-all hover:-translate-y-1 hover:shadow-lg ${item.bg}`}
            >
              <div className="text-4xl">
                {item.icon}
              </div>

              <h2 className="mt-5 text-2xl font-bold text-gray-800">
                {item.title}
              </h2>

              <p className="mt-2 text-gray-600">
                {item.desc}
              </p>

              <p className="mt-5 text-sm text-gray-500">
                {item.time}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* AI ALERT */}
      <div className="mt-8 rounded-[32px] border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6 shadow-sm">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-2xl bg-green-100 p-4 text-green-700">
              ⚠️
            </div>

            <div>
              <h2 className="text-2xl font-bold text-green-800">
                AI Smart Recommendation
              </h2>

              <p className="mt-2 max-w-3xl leading-relaxed text-green-700">
                High humidity detected in your region.
                Consider monitoring crops regularly to
                reduce stripe rust risk and improve yield
                quality.
              </p>
            </div>
          </div>

          <button className="rounded-2xl bg-green-700 px-6 py-4 font-semibold text-white transition-all hover:scale-105">
            View Insights
          </button>
        </div>
      </div>

      {/* SETTINGS MODAL */}
{openSettingsModal && (
  <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
    <div className="relative flex h-[650px] w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-2xl">
      {/* CLOSE */}
      <button
        onClick={() => setOpenSettingsModal(false)}
        className="absolute right-5 top-5 z-50 rounded-xl bg-gray-100 p-3 transition-all hover:bg-gray-200"
      >
        <X size={20} />
      </button>

      {/* SIDEBAR */}
      <div className="w-[280px] border-r border-gray-100 bg-gray-50 p-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Settings
        </h1>

        <div className="mt-8 space-y-3">
          {[
            {
              name: "General",
              icon: <Settings size={20} />,
            },

            {
              name: "Notifications",
              icon: <BellRing size={20} />,
            },

            {
              name: "Security",
              icon: <Shield size={20} />,
            },

            {
              name: "Appearance",
              icon: <Palette size={20} />,
            },
          ].map((item, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(item.name)}
              className={`flex w-full items-center gap-3 rounded-2xl px-5 py-4 font-medium transition-all ${
                activeTab === item.name
                  ? "bg-green-700 text-white"
                  : "text-gray-700 hover:bg-white"
              }`}
            >
              {item.icon}
              {item.name}
            </button>
          ))}
        </div>
      </div>

      {/* CONTENT */}
      <div className="flex-1 overflow-y-auto p-8">
        {/* GENERAL */}
        {activeTab === "General" && (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              General Settings
            </h2>

            <p className="mt-2 text-gray-500">
              Manage your account preferences
            </p>

            <div className="mt-10 grid gap-6">
              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Full Name
                </label>

                <input
                  type="text"
                  defaultValue={username || "User"}
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Email Address
                </label>

                <input
                  type="email"
                  placeholder="example@gmail.com"
                  className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
                />
              </div>

              <div>
                <label className="mb-2 block font-semibold text-gray-700">
                  Language
                </label>

                <select className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500">
                  <option>English</option>
                  <option>Tamil</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* NOTIFICATIONS */}
        {activeTab === "Notifications" && (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Notification Settings
            </h2>

            <p className="mt-2 text-gray-500">
              Control alerts and updates
            </p>

            <div className="mt-10 space-y-5">
              {[
                "Email Notifications",
                "Disease Alerts",
                "Yield Recommendations",
                "System Updates",
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-5"
                >
                  <div>
                    <h2 className="font-semibold text-gray-800">
                      {item}
                    </h2>

                    <p className="text-sm text-gray-500">
                      Enable or disable alerts
                    </p>
                  </div>

                  <input type="checkbox" className="h-5 w-5" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECURITY */}
        {activeTab === "Security" && (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Security Settings
            </h2>

            <p className="mt-2 text-gray-500">
              Manage account security
            </p>

            <div className="mt-10 grid gap-6">
              <input
                type="password"
                placeholder="Current password"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
              />

              <input
                type="password"
                placeholder="New password"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
              />

              <input
                type="password"
                placeholder="Confirm password"
                className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4 outline-none focus:border-green-500"
              />
            </div>
          </div>
        )}

        {/* APPEARANCE */}
        {activeTab === "Appearance" && (
          <div>
            <h2 className="text-4xl font-bold text-gray-800">
              Appearance
            </h2>

            <p className="mt-2 text-gray-500">
              Customize dashboard appearance
            </p>

            <div className="mt-10 grid gap-5 md:grid-cols-2">
              <button className="rounded-3xl border-2 border-green-700 bg-green-50 p-8 text-left">
                <div className="h-32 rounded-2xl bg-white shadow-sm" />

                <h2 className="mt-5 text-2xl font-bold text-gray-800">
                  Light Mode
                </h2>

                <p className="mt-2 text-gray-500">
                  Clean and minimal appearance
                </p>
              </button>

              <button className="rounded-3xl border border-gray-200 p-8 text-left">
                <div className="h-32 rounded-2xl bg-gray-900 shadow-sm" />

                <h2 className="mt-5 text-2xl font-bold text-gray-800">
                  Dark Mode
                </h2>

                <p className="mt-2 text-gray-500">
                  Modern dark appearance
                </p>
              </button>
            </div>
          </div>
        )}

        {/* SAVE BUTTON */}
        <button className="mt-10 rounded-2xl bg-green-700 px-8 py-4 font-semibold text-white transition-all hover:scale-105">
          Save Settings
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );
}