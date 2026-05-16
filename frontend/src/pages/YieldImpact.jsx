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
      const userId = localStorage.getItem("userId");

      const response = await fetch(
        "http://127.0.0.1:8000/predict/impact?user_id=" + userId,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            soil_type: form.Soil_Type,
            temperature: Number(form.Temperature),
            humidity: Number(form.Humidity)
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
      console.error(err);
      setError("Backend connection error");
    }

    setLoading(false);
  };

  const box = (bg) => ({
    marginTop: "15px",
    padding: "12px",
    borderRadius: "10px",
    background: bg,
    fontWeight: "500",
    color: "#000"
  });

  return (
    <div style={{
      minHeight: "100vh",
      padding: "40px",
      background: "#f5f7fa"   // 🔥 FORCE LIGHT BG
    }}>

      {/* MAIN CARD */}
      <div style={{
        background: "#1b4332",
        borderRadius: "30px",
        padding: "50px",
        color: "#ffffff"
      }}>

        <h1>🌱 Yield Impact & Fertilizer Recommendation</h1>
        <p style={{ opacity: 0.8 }}>
          Enter environmental details to estimate yield loss.
        </p>

        {/* INPUT CARD */}
        <div style={{
          marginTop: "30px",
          background: "#ffffff",
          padding: "30px",
          borderRadius: "20px",
          color: "#000",
          maxWidth: "600px"
        }}>

          <div style={{ marginBottom: "20px" }}>
            <label>Soil Type</label><br />
            <select name="Soil_Type" value={form.Soil_Type} onChange={handleChange} style={input}>
              <option value="">Select Soil</option>
              <option>Loamy</option>
              <option>Clay</option>
              <option>Sandy</option>
            </select>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Temperature</label><br />
            <input type="number" name="Temperature" value={form.Temperature} onChange={handleChange} style={input}/>
          </div>

          <div style={{ marginBottom: "20px" }}>
            <label>Humidity</label><br />
            <input type="number" name="Humidity" value={form.Humidity} onChange={handleChange} style={input}/>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <button onClick={handlePredict} style={btn}>
            {loading ? "Analyzing..." : "Analyze Impact"}
          </button>
        </div>

        {/* 🔥 RESULT CARD (FIXED) */}
        {result && (
          <div style={{
            marginTop: "40px",
            background: "#ffffff",   // 🔥 IMPORTANT
            color: "#000",           // 🔥 IMPORTANT
            padding: "30px",
            borderRadius: "20px",
            maxWidth: "600px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)"
          }}>

            <h2 style={{ color: "#1b4332" }}>📊 Prediction Result</h2>

            <div style={box("#e8f5e9")}>
              📉 Yield Loss: {result.loss}%
            </div>

            <div style={{
  marginTop: "10px",
  height: "8px",
  background: "#ddd",
  borderRadius: "10px"
}}>
  <div style={{
    width: `${result.loss}%`,
    background: "#1b4332",
    height: "100%",
    borderRadius: "10px"
  }}></div>
</div>

            <div style={box("#e3f2fd")}>
              🌱 Fertilizer: {result.fertilizer}
            </div>

            <div style={{
  ...box(result.status === "High Risk" ? "#f8d7da"
      : result.status === "Moderate" ? "#fff3cd"
      : "#d4edda")
}}>
  ⚠️ Risk Level: {result.status}
</div>

          </div>
        )}

      </div>
    </div>
  );
};

const input = {
  width: "100%",
  padding: "10px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  marginTop: "5px"
};

const btn = {
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#1b4332",
  color: "#fff",
  cursor: "pointer",
  width: "100%"
};

export default YieldImpact;