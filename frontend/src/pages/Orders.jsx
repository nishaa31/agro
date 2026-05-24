import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";

function Orders() {

  const [orders, setOrders] = useState([]);

  const farmerId =
    localStorage.getItem("userId");

  useEffect(() => {

    fetch(
      `http://localhost:8000/farmer-orders/${farmerId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-[#f4f7f2] p-6 overflow-auto">

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        Orders 📦
      </h1>

      {orders.length === 0 ? (

        <div className="bg-white p-10 rounded-3xl text-center">

          <h2 className="text-2xl font-semibold">
            No Orders Yet
          </h2>

        </div>

      ) : (

        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order.order_id}
              className="bg-white rounded-3xl p-6 shadow-sm"
            >

              <div className="flex items-center justify-between">

                <div>

                  <h2 className="text-2xl font-bold text-gray-900">
                    {order.product_name}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    Customer:
                    {" "}
                    {order.customer_name}
                  </p>

                  <p className="text-gray-500">
                    Phone:
                    {" "}
                    {order.customer_phone}
                  </p>

                  <p className="text-gray-500">
                    Quantity:
                    {" "}
                    {order.quantity}
                  </p>

                </div>

                <div className="text-right">

                  <p className="text-2xl font-bold text-green-700">
                    ₹{order.total_price}
                  </p>

                  <select
  value={order.status}

  onChange={async (e) => {

    const newStatus = e.target.value;

    try {

      await fetch(
        `http://localhost:8000/update-order/${order.order_id}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      setOrders(
        orders.map((item) =>

          item.order_id === order.order_id
            ? {
                ...item,
                status: newStatus,
              }
            : item
        )
      );

    } catch (err) {

      console.log(err);

    }

  }}

  className="mt-3 border border-gray-300 rounded-xl px-4 py-2 font-semibold"
>
  <option>Pending</option>
  <option>Accepted</option>
  <option>Packed</option>
  <option>Shipped</option>
  <option>Delivered</option>
</select>

                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
    </div>
  );
}

export default Orders;