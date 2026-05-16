import { useState } from "react";
import {
  UploadCloud,
  ShieldAlert,
  Pill,
  TrendingDown,
  Loader2,
  CheckCircle2,
  Sparkles,
  X,
} from "lucide-react";

const DiseaseDetection = () => {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // IMAGE UPLOAD
  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  // ANALYZE API
  const handleAnalyze = async () => {
    if (!imageFile) {
      alert("Please upload an image first");
      return;
    }

    const formData = new FormData();
    formData.append("file", imageFile);

    const userId = localStorage.getItem("userId");
    formData.append("user_id", userId);

    try {
      setLoading(true);

      const response = await fetch(
        "http://127.0.0.1:8000/predict/disease",
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  // SEVERITY COLORS
  const severityStyle = (severity) => {
    switch (severity) {
      case "High":
        return "bg-red-50 text-red-700 border-red-200";

      case "Medium":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Low":
        return "bg-green-50 text-green-700 border-green-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f7f2] p-6">
      {/* HEADER */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-green-100 p-3 text-green-700">
              <ShieldAlert size={28} />
            </div>

            <div>
              <h1 className="text-4xl font-bold text-gray-800">
                Disease Detection
              </h1>

              <p className="mt-1 text-gray-500">
                Upload wheat leaf image and let AI detect disease
              </p>
            </div>
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
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          {/* TITLE */}
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
              1
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                Upload Image
              </h2>

              <p className="text-sm text-gray-500">
                Drag & drop or browse image
              </p>
            </div>
          </div>

          {/* UPLOAD BOX */}
          <label className="group flex h-[320px] cursor-pointer flex-col items-center justify-center rounded-[28px] border-2 border-dashed border-green-300 bg-[#f7fbf7] transition-all duration-300 hover:border-green-600 hover:bg-green-50">
            {!preview ? (
              <>
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-green-700 transition-all duration-300 group-hover:scale-110">
                  <UploadCloud size={44} />
                </div>

                <h2 className="mt-6 text-2xl font-bold text-gray-800">
                  Drag & Drop Image
                </h2>

                <p className="mt-2 text-gray-500">
                  JPG, PNG, JPEG (Max 10MB)
                </p>

                <div className="mt-6 rounded-2xl border border-green-600 px-6 py-3 font-semibold text-green-700">
                  Browse Files
                </div>
              </>
            ) : (
              <div className="relative h-full w-full">
                <img
                  src={preview}
                  alt="preview"
                  className="h-full w-full rounded-[24px] object-cover"
                />

                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setPreview(null);
                    setImageFile(null);
                    setResult(null);
                  }}
                  className="absolute right-4 top-4 rounded-full bg-red-500 p-2 text-white shadow-lg"
                >
                  <X size={18} />
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>

          {/* ANALYZE BUTTON */}
          <button
            onClick={handleAnalyze}
            disabled={!imageFile || loading}
            className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#0f5132] to-[#198754] px-6 py-4 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-[1.01] hover:shadow-green-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={24} />
                Analyzing Disease...
              </>
            ) : (
              <>
                <Sparkles size={22} />
                Analyze Disease
              </>
            )}
          </button>

          {/* SAFE NOTE */}
          <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-500">
            <CheckCircle2 size={18} className="text-green-600" />
            Your data is safe and secure
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="rounded-[32px] bg-white p-6 shadow-sm">
          {/* TITLE */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-700 text-sm font-bold text-white">
                2
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  Detection Result
                </h2>

                <p className="text-sm text-gray-500">
                  AI-powered prediction result
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
                <ShieldAlert size={48} />
              </div>

              <h2 className="mt-6 text-3xl font-bold text-gray-800">
                No Prediction Yet
              </h2>

              <p className="mt-3 max-w-md text-gray-500">
                Upload wheat leaf image and click analyze to
                detect disease using AI.
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
                Processing wheat leaf image
              </p>
            </div>
          )}

          {/* RESULT */}
          {result && !loading && (
            <>
              {/* DISEASE CARD */}
              <div className="rounded-[28px] border border-red-100 bg-red-50 p-6">
                <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-center gap-5">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-sm">
                      <img
                        src={preview}
                        alt=""
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    </div>

                    <div>
                      <h1 className="text-5xl font-bold text-red-700">
                        {result?.disease
                          ?.replace("_", " ")
                          .toUpperCase()}
                      </h1>

                      <p className="mt-2 text-lg italic text-red-500">
                        Wheat Disease Detected
                      </p>
                    </div>
                  </div>

                  {/* SEVERITY */}
                  <div
                    className={`rounded-3xl border px-8 py-5 ${severityStyle(
                      result?.severity
                    )}`}
                  >
                    <h2 className="text-3xl font-bold">
                      {result?.severity}
                    </h2>

                    <p className="mt-1 text-sm font-medium">
                      Severity
                    </p>
                  </div>
                </div>
              </div>

              {/* CONFIDENCE */}
              <div className="mt-8">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-gray-800">
                    AI Confidence
                  </h2>

                  <span className="text-3xl font-bold text-green-700">
                    {(result?.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="h-5 overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-green-600 to-emerald-500"
                    style={{
                      width: `${result?.confidence * 100}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-gray-500">
                  The model is{" "}
                  {(result?.confidence * 100).toFixed(0)}%
                  confident in this prediction.
                </p>
              </div>

              {/* INFO CARDS */}
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {/* TREATMENT */}
                <div className="rounded-3xl bg-green-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-green-100 text-green-700">
                    <Pill size={28} />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-800">
                    Treatment
                  </h2>

                  <p className="mt-3 leading-relaxed text-gray-600">
                    {result?.treatment}
                  </p>
                </div>

                {/* YIELD LOSS */}
                <div className="rounded-3xl bg-orange-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-100 text-orange-700">
                    <TrendingDown size={28} />
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-800">
                    Yield Loss
                  </h2>

                  <h1 className="mt-4 text-5xl font-bold text-orange-700">
                    {result?.yield_loss}%
                  </h1>

                  <p className="mt-2 text-gray-500">
                    Estimated crop loss
                  </p>
                </div>

                {/* DATE */}
                <div className="rounded-3xl bg-violet-50 p-5">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
                    📅
                  </div>

                  <h2 className="mt-5 text-2xl font-bold text-gray-800">
                    Detected On
                  </h2>

                  <p className="mt-4 text-lg font-semibold text-gray-700">
                    {new Date().toDateString()}
                  </p>

                  <p className="text-gray-500">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div>
              </div>

              {/* OTHER PREDICTIONS */}
              <div className="mt-8 rounded-[28px] border border-gray-100 bg-gray-50 p-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  Other Possibilities
                </h2>

                <div className="mt-6 space-y-5">
                  {result?.top_predictions?.map((item, index) => (
                    <div key={index}>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="font-semibold text-gray-700">
                          {item?.disease?.replace("_", " ")}
                        </span>

                        <span className="font-bold text-gray-700">
                          {(item?.confidence * 100).toFixed(1)}%
                        </span>
                      </div>

                      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-green-600"
                          style={{
                            width: `${item?.confidence * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TIP */}
              <div className="mt-8 rounded-[28px] border border-green-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-green-100 p-4 text-green-700">
                    💡
                  </div>

                  <div>
                    <h2 className="text-2xl font-bold text-green-800">
                      Smart Farming Tip
                    </h2>

                    <p className="mt-3 leading-relaxed text-green-700">
                      {result?.explanation}
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DiseaseDetection;