import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [location, setLocation] = useState("");
  const [role, setRole] = useState("farmer");

  const [error, setError] = useState("");

  // 🔥 LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          phone,
          password,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Login failed");
        return;
      }

      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("username", data.name);
      localStorage.setItem("phone", data.phone);
      localStorage.setItem("location", data.location || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("profileImage", data.profile_image || "");
      localStorage.setItem("role", data.role);

      if (data.role === "farmer") {
        navigate("/home");
      } else {
        navigate("/consumer");
      }

    } catch (err) {
      console.log(err);
      setError(err.message || "Server error");
    }
  };

  // 🔥 REGISTER
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (!name || !phone || !password || !location) {
      setError("All fields are required");
      return;
    }

    try {
      const res = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          phone,
          password,
          location,
          role,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.detail || "Registration failed");
        return;
      }

      localStorage.setItem("userId", data.user_id);
      localStorage.setItem("username", data.name);
      localStorage.setItem("phone", data.phone);
      localStorage.setItem("location", data.location || "");
      localStorage.setItem("email", data.email || "");
      localStorage.setItem("profileImage", data.profile_image || "");
      localStorage.setItem("role", role);

      if (role === "farmer") {
        navigate("/home");
      } else {
        navigate("/consumer");
      }

    } catch (err) {
      console.log(err);
      setError(err.message || "Server error");
    }
  };

  return (
    <div className="login-page">

      {/* LEFT PANEL */}
      <div className="login-left">

        <div className="login-brand">
          <div className="brand-name">AgroPestro</div>
          <div className="brand-tag">
            Smart Wheat Intelligence Platform
          </div>
        </div>

        <div className="login-hero">

          <div className="hero-icon">
            🌾
          </div>

          <h1 className="hero-title">
            உங்கள் பயிரை
            <br />
            காப்போம்!
          </h1>

          <p className="hero-desc">
            AI-powered disease detection, yield prediction,
            and real-time farming advice.
          </p>

          <div className="feature-list">

            <div className="feature-item">
              <div className="feature-tick">✓</div>
              <span>Disease Detection</span>
            </div>

            <div className="feature-item">
              <div className="feature-tick">✓</div>
              <span>Yield Prediction</span>
            </div>

            <div className="feature-item">
              <div className="feature-tick">✓</div>
              <span>Marketplace Support</span>
            </div>

          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">

        <div className="login-form-box">

          <div className="form-top">

            <h2>
              {tab === "login"
                ? "Welcome back 👋"
                : "Create account 🌱"}
            </h2>

            <p>
              {tab === "login"
                ? "Login to manage your farm dashboard"
                : "Join AgroPestro for free"}
            </p>

          </div>

          {/* TABS */}
          <div className="auth-tabs">

            <button
              className={`auth-tab ${
                tab === "login" ? "active" : ""
              }`}
              onClick={() => {
                setTab("login");
                setError("");
              }}
            >
              Login
            </button>

            <button
              className={`auth-tab ${
                tab === "register" ? "active" : ""
              }`}
              onClick={() => {
                setTab("register");
                setError("");
              }}
            >
              Register
            </button>

          </div>

          <form
            onSubmit={
              tab === "login"
                ? handleLogin
                : handleRegister
            }
          >

            {/* NAME */}
            {tab === "register" && (
              <div className="form-group">
                <label>FULL NAME</label>

                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                  />
                </div>
              </div>
            )}

            {/* PHONE */}
            <div className="form-group">

              <label>PHONE NUMBER</label>

              <div className="input-wrap">
                <input
                  type="text"
                  placeholder="Enter phone number"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                />
              </div>

            </div>

            {/* PASSWORD */}
            <div className="form-group">

              <label>PASSWORD</label>

              <div className="input-wrap">
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                />
              </div>

            </div>

            {/* LOCATION */}
            {tab === "register" && (
              <div className="form-group">

                <label>LOCATION</label>

                <div className="input-wrap">
                  <input
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) =>
                      setLocation(e.target.value)
                    }
                  />
                </div>

              </div>
            )}

            {/* ROLE */}
            <div className="form-group">

              <label>ROLE</label>

              <select
                value={role}
                onChange={(e) =>
                  setRole(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "12px",
                  borderRadius: "10px",
                  border: "1px solid #ccc",
                }}
              >
                <option value="farmer">
                  Farmer
                </option>

                <option value="consumer">
                  Consumer
                </option>

              </select>
            </div>

            {/* ERROR */}
            {error && (
              <div className="form-error">
                {error}
              </div>
            )}

            {/* BUTTON */}
            <button
              className="btn-submit"
              type="submit"
            >
              {tab === "login"
                ? "Login to AgroPestro"
                : "Create Account"}
            </button>

          </form>

        </div>
      </div>
    </div>
  );
}