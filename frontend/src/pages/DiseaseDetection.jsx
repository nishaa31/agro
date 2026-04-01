import { useState } from "react";

const DiseaseDetection = () => {
  const [preview, setPreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

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

      // 🔥 FULL DATA STORE
      setResult(data);

    } catch (error) {
      console.error("Error:", error);
      alert("Backend connection error");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityStyle = (severity) => {
    if (severity === "Low")
      return { backgroundColor: "#d4edda", color: "#155724" };

    if (severity === "Medium")
      return { backgroundColor: "#fff3cd", color: "#856404" };

    if (severity === "High")
      return { backgroundColor: "#f8d7da", color: "#721c24" };

    return {};
  };

  return (
    <div style={{ minHeight: "100vh", padding: "40px" }}>
      <div
        style={{
          background: "linear-gradient(135deg,#0f2b24,#123c32)",
          borderRadius: "30px",
          padding: "50px",
          color: "#e6e3db",
        }}
      >
        <h1 style={{ fontSize: "32px", fontWeight: "700" }}>
          🌿 Crop Disease Detection
        </h1>

        <p style={{ marginTop: "10px", opacity: "0.8" }}>
          Upload a leaf image to detect disease and severity level.
        </p>

        {/* Upload */}
        <div
          style={{
            marginTop: "40px",
            backgroundColor: "#d9dfd6",
            padding: "40px",
            borderRadius: "25px",
            color: "#0f2b24",
            maxWidth: "900px",
          }}
        >
          <label>Upload Leaf Image</label>
          <br />

          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "10px" }}
          />

          {preview && (
            <div style={{ marginTop: "20px" }}>
              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "250px",
                  height: "250px",
                  objectFit: "cover",
                  borderRadius: "15px",
                }}
              />
            </div>
          )}

          <button
            onClick={handleAnalyze}
            style={{
              marginTop: "20px",
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#1f7a4c",
              color: "#ffffff",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Analyzing..." : "Analyze Disease"}
          </button>
        </div>

        {/* RESULT */}
        {result && (
          <div
            style={{
              marginTop: "40px",
              backgroundColor: "#d9dfd6",
              padding: "30px",
              borderRadius: "25px",
              color: "#0f2b24",
              maxWidth: "900px",
            }}
          >
            <h2>Detection Result</h2>

            {/* Disease */}
            <h3 style={{ marginTop: "10px" }}>
              {result?.disease?.replace("_", " ").toUpperCase()}
            </h3>

            {/* Confidence */}
            <p style={{ marginTop: "10px" }}>
              <strong>Confidence:</strong>{" "}
              {(result.confidence * 100).toFixed(2)}%
            </p>

            {/* Bar */}
            <div
              style={{
                height: "8px",
                background: "#ccc",
                borderRadius: "10px",
                marginTop: "5px",
              }}
            >
              <div
                style={{
                  width: `${result.confidence * 100}%`,
                  background: "#28a745",
                  height: "100%",
                  borderRadius: "10px",
                }}
              ></div>
            </div>

            {/* Severity */}
            <div
              style={{
                marginTop: "15px",
                padding: "10px",
                borderRadius: "10px",
                fontWeight: "600",
                ...getSeverityStyle(result.severity),
              }}
            >
              Severity: {result.severity}
            </div>

            {/* Explanation */}
            <p style={{ marginTop: "15px" }}>{result.explanation}</p>

            {/* Treatment */}
            <div style={{ marginTop: "15px" }}>
              💊 <strong>Treatment:</strong> {result.treatment}
            </div>

            {/* Yield Loss */}
            <div style={{ marginTop: "10px" }}>
              📉 <strong>Yield Loss:</strong> {result.yield_loss}%
            </div>

            {/* Top Predictions */}
            <div style={{ marginTop: "15px" }}>
              <strong>Other Possibilities:</strong>
              {result.top_predictions.map((item, i) => (
                <p key={i}>
                  {item.disease} → {(item.confidence * 100).toFixed(1)}%
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DiseaseDetection;