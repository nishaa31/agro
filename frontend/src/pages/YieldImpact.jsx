import { useState } from "react";

const YieldImpact = () => {

  const [form, setForm] = useState({
    Soil_Type: "",
    Temperature: "",
    Humidity: ""
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handlePredict = async () => {

    if (!form.Soil_Type || !form.Temperature || !form.Humidity) {
      setError("Please fill all fields!");
      return;
    }

    setLoading(true);
    setError(null);

    try {

      const response = await fetch(
        "http://127.0.0.1:8000/predict/impact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            soil_type: form.Soil_Type,
            temperature: parseFloat(form.Temperature),
            humidity: parseFloat(form.Humidity)
          })
        }
      );

      const data = await response.json();

      setResult({
        fertilizer: data.fertilizer,
        loss: data.yield_loss,
        status: data.status
      });

    } catch (err) {
      setError("Backend connection error");
    }

    setLoading(false);
  };

  return (
    <div
      style={{
        backgroundColor: "#dfe5e2",
        minHeight: "100vh",
        padding: "40px",
      }}
    >

      <div
        style={{
          background: "linear-gradient(135deg,#0f2b24,#123c32)",
          borderRadius: "30px",
          padding: "50px",
          color: "#e6e3db",
        }}
      >

        <h1 style={{ fontSize: "32px", fontWeight: "700" }}>
          Yield Impact & Fertilizer Recommendation
        </h1>

        <p style={{ marginTop: "10px", opacity: "0.8" }}>
          Enter environmental details to estimate yield loss.
        </p>

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

          {/* Soil Type */}
          <div style={{ marginBottom: "20px" }}>
            <label>Soil Type</label>
            <br />
            <select
              name="Soil_Type"
              value={form.Soil_Type}
              onChange={handleChange}
              style={inputStyle}
            >
              <option value="">Select Soil</option>
              <option>Loamy</option>
              <option>Clay</option>
              <option>Sandy</option>
              <option>Peaty</option>
              <option>Saline</option>
            </select>
          </div>

          {/* Temperature */}
          <div style={{ marginBottom: "20px" }}>
            <label>Temperature (°C)</label>
            <br />
            <input
              type="number"
              name="Temperature"
              value={form.Temperature}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* Humidity */}
          <div style={{ marginBottom: "20px" }}>
            <label>Humidity (%)</label>
            <br />
            <input
              type="number"
              name="Humidity"
              value={form.Humidity}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {error && (
            <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>
          )}

          <button
            onClick={handlePredict}
            disabled={loading}
            style={{
              padding: "12px 24px",
              borderRadius: "12px",
              border: "none",
              backgroundColor: "#a8bfa0",
              color: "#0f2b24",
              fontWeight: "600",
              cursor: "pointer",
            }}
          >
            {loading ? "Analyzing..." : "Analyze Impact"}
          </button>

        </div>

        {/* RESULT CARD */}

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

            <h2>Prediction Result</h2>

            <p style={{ marginTop: "10px" }}>
              <strong>Estimated Yield Loss:</strong> {result.loss}
            </p>

            <p style={{ marginTop: "10px" }}>
             <strong>Recommended Fertilizer:</strong>{" "}
             {result?.fertilizer || "No recommendation"}
            </p>
            <p style={{ marginTop: "10px" }}>
  <strong>Risk Level:</strong>{" "}
  {result?.status || "N/A"}
</p>
          </div>

        )}

      </div>
    </div>
  );
};

const inputStyle = {
  marginTop: "5px",
  padding: "10px",
  width: "300px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  backgroundColor: "#ffffff",
  color: "#0f2b24",
};

export default YieldImpact;