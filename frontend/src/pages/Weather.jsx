import Sidebar from "../components/Sidebar";

export default function Weather() {

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ padding: "30px", flex: 1 }}>

        <h2>Weather Information</h2>

        <p>Temperature: 32°C</p>
        <p>Humidity: 70%</p>
        <p>Rain chance: 40%</p>

      </div>
    </div>
  );
}