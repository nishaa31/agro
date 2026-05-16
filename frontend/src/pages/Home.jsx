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
} from "lucide-react";

import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {

  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

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

  return (
    <div className="flex min-h-screen bg-[#f4f7f2]">
      {/* SIDEBAR */}
      

      {/* MAIN CONTENT */}
      <main className="flex-1 p-6">
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

          {/* PROFILE */}
          <div className="flex items-center gap-5">
            <button className="relative rounded-xl bg-gray-100 p-3">
              <Bell size={20} />

              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-600 text-xs text-white">
                3
              </span>
            </button>

            <div className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2">
              <img
                src="https://i.pravatar.cc/100"
                alt="profile"
                className="h-12 w-12 rounded-full object-cover"
              />

              <div>
                <h2 className="font-semibold text-gray-800">
                  {username || "User"}
                </h2>

                <p className="text-sm text-gray-500">
                  Admin
                </p>
              </div>

              <ChevronDown size={18} />
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
              <button onClick={() => navigate("/disease")} className="flex items-center gap-2 rounded-2xl bg-green-700 px-6 py-4 font-semibold text-white transition-all hover:scale-105">
                Start Prediction
                <ArrowRight size={18} />
              </button>

              <button onClick={() => navigate("/insights")} className="rounded-2xl border border-green-700 px-6 py-4 font-semibold text-green-700 transition-all hover:bg-green-50">
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
              className="rounded-[28px] bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
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
              className={`rounded-[30px] p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl ${item.bg}`}
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
      </main>
    </div>
  );
}