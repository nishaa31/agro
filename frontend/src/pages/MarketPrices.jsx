import Sidebar from "../components/Sidebar";

export default function MarketPrices() {

  return (
    <div style={{ display: "flex" }}>

      <Sidebar />

      <div style={{ padding: "30px", flex: 1 }}>

        <h2>Market Prices</h2>

        <p>Wheat: ₹2200 / quintal</p>
        <p>Rice: ₹2500 / quintal</p>
        <p>Maize: ₹1800 / quintal</p>

      </div>
    </div>
  );
}