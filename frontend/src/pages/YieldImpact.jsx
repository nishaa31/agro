import { useState } from "react";
import {
  Sprout,
  Thermometer,
  Droplets,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  TrendingDown,
  BarChart3,
  Leaf,
  Sparkles,
} from "lucide-react";
import Sidebar from "../components/Sidebar";

const YieldImpact = () => {
  const [form, setForm] = useState({
    Soil_Type: "",
    Temperature: "",
    Humidity: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // INPUT CHANGE
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });

    setError("");
  };

  // API CALL
  const handlePredict = async () => {
    if (
      !form.Soil_Type ||
      !form.Temperature ||
      !form.Humidity
    ) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const userId = localStorage.getItem("userId");

      const response = await fetch(
        "http://127.0.0.1:8000/predict/impact?user_id=" +
          userId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            soil_type: form.Soil_Type,
            temperature: Number(form.Temperature),
            humidity: Number(form.Humidity),
          }),
        }
      );

      const data = await response.json();

      setResult({
        fertilizer: data.fertilizer,
        loss: data.yield_loss,
        status: data.status,
      });
    } catch (err) {
      console.error(err);
      setError("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  // STATUS COLORS
  const riskStyle = (status) => {
    switch (status) {
      case "High Risk":
        return {
          bg: "bg-red-50",
          text: "text-red-700",
          border: "border-red-200",
        };

      case "Moderate":
        return {
          bg: "bg-yellow-50",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };

      default:
        return {
          bg: "bg-green-50",
          text: "text-green-700",
          border: "border-green-200",
        };
    }
  };

  const risk = result
    ? riskStyle(result.status)
    : riskStyle("");

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 min-h-screen bg-[#f4f7f2] p-6 overflow-auto">
      <div className="w-full">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="rounded-2xl bg-green-100 p-4 text-green-700">
            <Sprout size={30} />
          </div>

          <div>
            <h1 className="text-4xl font-bold text-gray-800">
              Yield Impact & Fertilizer Recommendation
            </h1>

            <p className="mt-1 text-gray-500">
              Analyze environmental conditions and estimate
              crop impact using AI.
            </p>
          </div>
        </div>

        <div className="hidden rounded-2xl bg-white px-5 py-4 shadow-sm md:block">
          <h2 className="font-semibold text-gray-700">
            {new Date().toDateString()}
          </h2>

          <p className="text-sm text-gray-500">
            {new Date().toLocaleTimeString()}
          </p>
        </div>
      </div>

      {/* MAIN GRID */}
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT PANEL */}
        <div className="rounded-[32px] bg-white p-7 shadow-sm">
          {/* TITLE */}
          <div className="mb-8">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                <Leaf size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Environmental Details
                </h2>

                <p className="text-sm text-gray-500">
                  Enter crop environmental data
                </p>
              </div>
            </div>
          </div>

          {/* SOIL */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold text-gray-700">
              Soil Type
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <Sprout className="text-green-700" size={22} />

              <select
                name="Soil_Type"
                value={form.Soil_Type}
                onChange={handleChange}
                className="w-full bg-transparent outline-none"
              >
                <option value="">Select Soil Type</option>
                <option>Loamy</option>
                <option>Clay</option>
                <option>Sandy</option>
              </select>
            </div>
          </div>

          {/* TEMPERATURE */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold text-gray-700">
              Temperature (°C)
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <Thermometer
                className="text-orange-500"
                size={22}
              />

              <input
                type="number"
                name="Temperature"
                value={form.Temperature}
                onChange={handleChange}
                placeholder="Enter temperature"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* HUMIDITY */}
          <div className="mb-6">
            <label className="mb-2 block font-semibold text-gray-700">
              Humidity (%)
            </label>

            <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-4">
              <Droplets
                className="text-blue-500"
                size={22}
              />

              <input
                type="number"
                name="Humidity"
                value={form.Humidity}
                onChange={handleChange}
                placeholder="Enter humidity"
                className="w-full bg-transparent outline-none"
              />
            </div>
          </div>

          {/* ERROR */}
          {error && (
            <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-red-700">
              {error}
            </div>
          )}

          {/* BUTTON */}
          <button
            onClick={handlePredict}
            disabled={loading}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0f5132] to-[#198754] px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-green-200 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2
                  className="animate-spin"
                  size={24}
                />
                Analyzing Impact...
              </>
            ) : (
              <>
                <Sparkles size={22} />
                Analyze Impact
              </>
            )}
          </button>

          {/* SAFE NOTE */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
            <ShieldCheck
              size={18}
              className="text-green-600"
            />
            Your data is secure and private
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-[32px] bg-white p-7 shadow-sm">
          {/* HEADER */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-green-100 p-3 text-green-700">
                <BarChart3 size={26} />
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Analysis Results
                </h2>

                <p className="text-sm text-gray-500">
                  AI generated prediction results
                </p>
              </div>
            </div>

            {result && (
              <div className="rounded-2xl bg-green-50 px-5 py-3 text-sm font-semibold text-green-700">
                ✅ Analysis Completed
              </div>
            )}
          </div>

          {/* EMPTY STATE */}
          {!result && !loading && (
            <div className="flex h-[500px] flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-gray-200 bg-gray-50 text-center">
              <div className="rounded-full bg-green-100 p-6 text-green-700">
                <BarChart3 size={48} />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-gray-800">
                No Analysis Yet
              </h2>

              <p className="mt-3 max-w-md text-gray-500">
                Fill environmental details and analyze impact
                to generate AI recommendations.
              </p>
            </div>
          )}

          {/* LOADING */}
          {loading && (
            <div className="flex h-[500px] flex-col items-center justify-center">
              <Loader2
                className="animate-spin text-green-700"
                size={60}
              />

              <h2 className="mt-6 text-3xl font-bold text-gray-800">
                AI is Analyzing...
              </h2>

              <p className="mt-2 text-gray-500">
                Processing environmental data
              </p>
            </div>
          )}

          {/* RESULT */}
          {result && !loading && (
            <>
              {/* TOP CARDS */}
              <div className="grid gap-5 md:grid-cols-3">
                {/* YIELD LOSS */}
                <div className="rounded-3xl border border-red-100 bg-red-50 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-100 text-red-700">
                    <TrendingDown size={28} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-gray-800">
                    Yield Loss
                  </h2>

                  <h1 className="mt-4 text-5xl font-bold text-red-700">
                    {result.loss}%
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Estimated crop impact
                  </p>
                </div>

                {/* FERTILIZER */}
                <div className="rounded-3xl border border-green-100 bg-green-50 p-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    🌱
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-gray-800">
                    Fertilizer
                  </h2>

                  <h1 className="mt-4 text-3xl font-bold text-green-700">
                    {result.fertilizer}
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Recommended fertilizer
                  </p>
                </div>

                {/* STATUS */}
                <div
                  className={`rounded-3xl border p-6 ${risk.bg} ${risk.border}`}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${risk.bg} ${risk.text}`}
                  >
                    <AlertTriangle size={28} />
                  </div>

                  <h2 className="mt-5 text-xl font-bold text-gray-800">
                    Risk Level
                  </h2>

                  <h1
                    className={`mt-4 text-4xl font-bold ${risk.text}`}
                  >
                    {result.status}
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Environmental risk status
                  </p>
                </div>
              </div>

              {/* PROGRESS */}
              <div className="mt-8 rounded-[28px] border border-gray-100 bg-gray-50 p-6">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-800">
                    Yield Loss Percentage
                  </h2>

                  <span className="text-3xl font-bold text-green-700">
                    {result.loss}%
                  </span>
                </div>

                <div className="h-5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500"
                    style={{
                      width: `${result.loss}%`,
                    }}
                  />
                </div>

                <p className="mt-4 text-gray-500">
                  AI estimated crop yield reduction based on
                  environmental conditions.
                </p>
              </div>

              {/* RECOMMENDATION */}
              <div className="mt-8 rounded-[28px] border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-green-100 p-4 text-green-700">
                    💡
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-green-800">
                      Smart Recommendation
                    </h2>

                    <p className="mt-3 leading-relaxed text-green-700">
                      Apply{" "}
                      <span className="font-bold">
                        {result.fertilizer}
                      </span>{" "}
                      fertilizer and regularly monitor humidity
                      and temperature to reduce yield impact and
                      improve crop health.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </div>
    </div>
  );
};

export default YieldImpact;