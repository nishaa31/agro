import { useEffect, useState } from "react";

function Profile() {
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    console.log("USER ID:", userId);

    fetch(`http://127.0.0.1:8000/profile/${Number(userId)}`)
      .then(res => res.json())
      .then(data => setProfile(data));
  }, []);

  if (!profile) {
    return <h2 style={{ padding: "20px" }}>Loading...</h2>;
  }

  const handleImageUpload = async (e) => {
  const file = e.target.files[0];
  const userId = localStorage.getItem("userId");

  const formData = new FormData();
  formData.append("file", file);

  await fetch(`http://127.0.0.1:8000/upload/profile/${userId}`, {
    method: "POST",
    body: formData,
  });

  window.location.reload();
};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #e6f0ff, #f5f7fa)",
      padding: "40px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      
      <div style={{
        background: "#ffffff",
        padding: "30px",
        borderRadius: "20px",
        width: "350px",
        textAlign: "center",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)"
      }}>

        {/* Profile Icon */}
        <div style={{
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "#4a6cf7",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "30px",
          margin: "0 auto 15px"
        }}>
          👤
        </div>
        
        {/* Name */}
        <h2 style={{ margin: "10px 0", color: "#333" }}>
          {profile.name}
        </h2>

        {/* Info Box */}
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
    </div>
  );
}

// 🔥 styles
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