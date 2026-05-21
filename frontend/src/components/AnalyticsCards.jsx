import React from "react";
import {
  Activity,
  ShieldCheck,
  AlertTriangle,
  TrendingUp,
} from "lucide-react";

const analyticsData = [
  {
    title: "Total Scans",
    value: "1,248",
    growth: "+18%",
    icon: Activity,
    bg: "from-green-500/20 to-emerald-500/10",
    iconBg: "bg-green-500/20",
    iconColor: "text-green-400",
  },
  {
    title: "Model Accuracy",
    value: "96%",
    growth: "+4%",
    icon: ShieldCheck,
    bg: "from-blue-500/20 to-cyan-500/10",
    iconBg: "bg-blue-500/20",
    iconColor: "text-blue-400",
  },
  {
    title: "Disease Alerts",
    value: "15",
    growth: "+6",
    icon: AlertTriangle,
    bg: "from-orange-500/20 to-yellow-500/10",
    iconBg: "bg-orange-500/20",
    iconColor: "text-orange-400",
  },
  {
    title: "Yield Growth",
    value: "12%",
    growth: "+2.4%",
    icon: TrendingUp,
    bg: "from-purple-500/20 to-pink-500/10",
    iconBg: "bg-purple-500/20",
    iconColor: "text-purple-400",
  },
];

const AnalyticsCards = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mt-8">
      {analyticsData.map((item, index) => {
        const Icon = item.icon;

        return (
          <div
            key={index}
            className={`relative overflow-hidden rounded-[28px] p-6 bg-gradient-to-br ${item.bg} backdrop-blur-xl border border-white/40 shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-2 hover:scale-[1.02] transition-all duration-300`}
          >
            {/* Glow */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

            {/* Icon */}
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${item.iconBg}`}
            >
              <Icon className={`${item.iconColor}`} size={30} />
            </div>

            {/* Text */}
            <div>
              <p className="text-gray-600 text-sm mb-2">
                {item.title}
              </p>

              <h2 className="text-4xl font-bold text-[#111827] mb-3">
                {item.value}
              </h2>

              <div className="flex items-center gap-2">
                <span className="text-green-600 font-semibold text-sm">
                  ↑ {item.growth}
                </span>

                <span className="text-gray-500 text-sm">
                  this month
                </span>
              </div>
            </div>

            {/* Mini Progress */}
            <div className="mt-6">
              <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-emerald-400"
                  style={{
                    width:
                      item.title === "Model Accuracy"
                        ? "96%"
                        : item.title === "Yield Growth"
                        ? "72%"
                        : item.title === "Disease Alerts"
                        ? "40%"
                        : "85%",
                  }}
                ></div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AnalyticsCards;