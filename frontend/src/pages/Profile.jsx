import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    fetch(`http://127.0.0.1:8000/profile/${Number(userId)}`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  if (!profile) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  const getIcon = (type) => {
    if (type === "disease") return "🌿";
    if (type === "yield") return "📊";
    if (type === "timeseries") return "📈";
    if (type === "impact") return "⚠️";
    return "📌";
  };

  return (
    <div className="flex">
      <Sidebar />
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e6f0ff, #f5f7fa)",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>

      {/* PROFILE CARD */}
      <div style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "20px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>

        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "#1b4332",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          margin: "0 auto 15px"
        }}>
          👤
        </div>

        <h2 style={{ margin: "10px 0", color: "#333" }}>
          {profile.name}
        </h2>

        <div style={{ marginTop: "20px", textAlign: "left" }}>
          <div style={cardStyle}>
            <span style={labelStyle}>📱 Phone</span>
            <p style={valueStyle}>{profile.phone}</p>
          </div>

          <div style={cardStyle}>
            <span style={labelStyle}>📍 Location</span>
            <p style={valueStyle}>{profile.location}</p>
          </div>
        </div>
      </div>

      {/* 🔥 HISTORY SECTION */}
      <div style={{
        marginTop: "40px",
        width: "100%",
        maxWidth: "700px"
      }}>
        <h2 style={{ marginBottom: "20px", color: "#1b4332" }}>
          📜 Activity History
        </h2>

        {profile.history && profile.history.length > 0 ? (
          profile.history.map((item, i) => (
            <div key={i} style={{
              background: "#ffffff",
              padding: "15px 20px",
              borderRadius: "12px",
              marginBottom: "15px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>

              <div>
                <div style={{
                  fontWeight: "bold",
                  color: "#1b4332"
                }}>
                  {getIcon(item.type)} {item.type.toUpperCase()}
                </div>

                <div style={{ marginTop: "5px" }}>
                  {item.result}
                </div>
              </div>

              <div style={{
                fontSize: "12px",
                color: "gray"
              }}>
                {item.date}
              </div>

            </div>
          ))
        ) : (
          <p>No activity yet</p>
        )}
      </div>

    </div>
    </div>
  );
}

// styles
const cardStyle = {
  background: "#f8f9ff",
  padding: "12px 15px",
  borderRadius: "10px",
  marginBottom: "12px"
};

const labelStyle = {
  fontSize: "12px",
  color: "#666"
};

const valueStyle = {
  fontSize: "16px",
  fontWeight: "bold",
  color: "#222",
  margin: "5px 0 0"
};

export default Profile;