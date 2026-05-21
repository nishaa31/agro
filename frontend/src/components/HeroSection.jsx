import React from "react";
import {
  ArrowRight,
  ShieldCheck,
  Activity,
  Wheat,
  ScanLine,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

const HeroSection = () => {

    
  const navigate = useNavigate();

  return (
    <div className="relative overflow-hidden rounded-[36px] bg-gradient-to-br from-[#052e16] via-[#14532d] to-[#166534] p-8 lg:p-12 text-white shadow-2xl">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-green-400/20 blur-3xl rounded-full"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-emerald-300/10 blur-3xl rounded-full"></div>

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* LEFT CONTENT */}
        <div>
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md mb-6">
            <Wheat size={18} className="text-green-300" />
            <span className="text-sm font-medium text-green-100">
              AI Powered Agriculture
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight mb-6">
            Smart Wheat
            <span className="block text-green-300">
              Disease Detection
            </span>
          </h1>

          {/* Description */}
          <p className="text-green-100 text-lg leading-relaxed max-w-xl mb-8">
            Predict crop yield, detect wheat diseases instantly and gain
            AI-driven farming insights to improve agricultural productivity.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 mb-10">

  <button
    onClick={() => navigate("/disease-detection")}
    className="px-6 py-4 rounded-2xl bg-white text-[#14532d] font-semibold flex items-center gap-2 hover:scale-105 transition-all duration-300 shadow-lg"
  >
    Start Detection
    <ArrowRight size={18} />
  </button>

  <button
    onClick={() => navigate("/insights")}
    className="px-6 py-4 rounded-2xl border border-white/20 bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300"
  >
    Explore Insights
  </button>

</div>

          {/* Trusted Users */}
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              <img
                src="https://i.pravatar.cc/100?img=12"
                alt=""
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=32"
                alt=""
                className="w-12 h-12 rounded-full border-2 border-white"
              />
              <img
                src="https://i.pravatar.cc/100?img=15"
                alt=""
                className="w-12 h-12 rounded-full border-2 border-white"
              />
            </div>

            <div>
              <h4 className="font-semibold text-lg">
                Trusted by 2000+ Farmers
              </h4>
              <p className="text-green-100 text-sm">
                Across multiple agricultural regions
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT CONTENT */}
        <div className="relative flex justify-center">
          
          {/* Main Image */}
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop"
              alt="Wheat"
              className="w-full max-w-[580px] h-[420px] object-cover rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
            />

            {/* Overlay */}
            <div className="absolute inset-0 rounded-[32px] bg-gradient-to-t from-black/60 via-black/10 to-transparent"></div>
          </div>

          {/* Floating Card 1 */}
          <div className="absolute top-6 -left-6 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl w-56">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-green-400/20">
                <ShieldCheck className="text-green-300" size={24} />
              </div>

              <div>
                <p className="text-sm text-green-100">
                  Model Accuracy
                </p>
                <h2 className="text-3xl font-bold">96%</h2>
              </div>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="w-[96%] h-full bg-green-400 rounded-full"></div>
            </div>
          </div>

          {/* Floating Card 2 */}
          <div className="absolute bottom-8 -right-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-5 shadow-2xl w-64">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-2xl bg-emerald-400/20">
                <ScanLine className="text-emerald-300" size={24} />
              </div>

              <div>
                <p className="text-sm text-green-100">
                  Live Detection
                </p>
                <h3 className="font-semibold text-lg">
                  Wheat Rust Found
                </h3>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-green-100">Confidence</span>
              <span className="font-semibold text-green-300">
                94%
              </span>
            </div>
          </div>

          {/* Floating Card 3 */}
          <div className="absolute bottom-28 left-0 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-4 shadow-2xl w-48">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-blue-400/20">
                <Activity className="text-blue-300" size={22} />
              </div>

              <div>
                <p className="text-sm text-green-100">
                  Crop Health
                </p>
                <h3 className="text-2xl font-bold">
                  87%
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;