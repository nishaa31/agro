import { useEffect, useState } from "react";
import ConsumerSidebar from "../components/ConsumerSidebar";

function MyOrders() {

  const [orders, setOrders] = useState([]);

  const customerId =
    localStorage.getItem("userId");

  useEffect(() => {

    fetch(
      `http://localhost:8000/customer-orders/${customerId}`
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

    <div className="min-h-screen bg-[#f5f7f2] p-10">

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        My Orders 🛍
      </h1>

      {orders.length === 0 ? (

        <div className="bg-white p-10 rounded-3xl text-center">

          <h2 className="text-2xl font-semibold">
            No Orders Found
          </h2>

        </div>

      ) : (

        <div className="space-y-5">

          {orders.map((order) => (

            <div
              key={order.order_id}
              className="bg-white rounded-3xl p-5 shadow-sm flex items-center gap-5"
            >

              <img
                src={order.image}
                alt={order.product_name}
                className="w-32 h-32 rounded-2xl object-cover"
              />

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {order.product_name}
                </h2>

                <p className="text-gray-500 mt-2">
                  Quantity:
                  {" "}
                  {order.quantity}
                </p>

                <p className="text-green-700 text-xl font-bold mt-2">
                  ₹{order.total_price}
                </p>

              </div>

              <div>

                <div className="bg-green-100 text-green-700 px-5 py-3 rounded-2xl font-semibold">
                  {order.status}
                </div>

              </div>

            </div>

          ))}

        </div>

      )}

    </div>
  );
}

export default MyOrders;