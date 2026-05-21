import React from "react";
import {
  ScanLine,
  BarChart3,
  Clock3,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const features = [
  {
    title: "Disease Detection",
    description:
      "Upload wheat leaf images and identify diseases instantly using AI-powered CNN models.",
    image:
      "https://images.unsplash.com/photo-1471193945509-9ad0617afabf?q=80&w=1200&auto=format&fit=crop",
    icon: <ScanLine size={24} />,
    stats: ["96% Accuracy", "CNN Model", "Real-time Scan"],
    route: "/disease-detection",
    glow: "from-green-600/70",
  },
  {
    title: "Yield Prediction",
    description:
      "Predict future crop yield using environmental and agricultural data analysis.",
    image:
      "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop",
    icon: <BarChart3 size={24} />,
    stats: ["ML Regression", "Live Analytics", "High Precision"],
    route: "/yield-impact",
    glow: "from-blue-600/70",
  },
  {
    title: "Time Series Forecast",
    description:
      "Analyze crop growth trends and forecast future agricultural performance.",
    image:
      "https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop",
    icon: <Clock3 size={24} />,
    stats: ["Forecast AI", "Trend Analysis", "Seasonal Data"],
    route: "/time-series",
    glow: "from-orange-600/70",
  },
];

const FeatureCards = () => {
  const navigate = useNavigate();

  return (
    <div className="mt-10">
      
      {/* Section Heading */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-[#0f172a] mb-3">
          Smart Agriculture Modules
        </h2>

        <p className="text-gray-600 text-lg">
          AI-powered tools for disease detection, yield prediction
          and crop forecasting.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {features.map((item, index) => (
          <div
            key={index}
            className="group relative overflow-hidden rounded-[36px] h-[520px] shadow-[0_15px_50px_rgba(0,0,0,0.12)] hover:-translate-y-3 transition-all duration-500"
          >
            {/* Background Image */}
            <img
              src={item.image}
              alt={item.title}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-all duration-700"
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>

            {/* Glow */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${item.glow} to-transparent opacity-40`}
            ></div>

            {/* Content */}
            <div className="relative z-10 h-full flex flex-col justify-end p-8 text-white">
              
              {/* Icon */}
              <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center mb-6">
                {item.icon}
              </div>

              {/* Title */}
              <h2 className="text-4xl font-bold mb-4 leading-tight">
                {item.title}
              </h2>

              {/* Description */}
              <p className="text-gray-200 text-lg leading-relaxed mb-6">
                {item.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-3 mb-8">
                {item.stats.map((stat, i) => (
                  <div
                    key={i}
                    className="px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-sm font-medium"
                  >
                    {stat}
                  </div>
                ))}
              </div>

              {/* Button */}
              <button
                onClick={() => navigate(item.route)}
                className="w-full py-4 rounded-2xl bg-white text-[#14532d] font-semibold flex items-center justify-center gap-2 hover:gap-4 transition-all duration-300"
              >
                Launch Module
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeatureCards;