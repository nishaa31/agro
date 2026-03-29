import { useEffect, useState } from "react";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("agropestro_profile"));
    setUser(data);
  }, []);

  if (!user) {
    return <h2>No user data found</h2>;
  }

  return (
    <div style={{ padding: "30px" }}>
      <h1>👤 Farmer Profile</h1>

      <div style={{
        background: "#fff",
        padding: "20px",
        borderRadius: "12px",
        marginTop: "20px",
        maxWidth: "400px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
      }}>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Phone:</strong> {user.phone}</p>
        <p><strong>Location:</strong> {user.location}</p>
      </div>
    </div>
  );
}

export default Profile;