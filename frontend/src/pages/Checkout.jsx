import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConsumerSidebar from "../components/ConsumerSidebar";

function Checkout() {

  const [cart, setCart] = useState([]);

  const navigate = useNavigate();

  const userId =
    localStorage.getItem("userId");

  useEffect(() => {

    fetch(
      `http://localhost:8000/cart/${userId}`
    )
      .then((res) => res.json())
      .then((data) => {
        setCart(data);
      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  const total = cart.reduce(
    (acc, item) =>
      acc + item.price * item.quantity,
    0
  );

  const handlePlaceOrder = async () => {

    try {

      const res = await fetch(
        "http://localhost:8000/place-order",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id: userId,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

      navigate("/consumer");

    } catch (err) {

      console.log(err);
      alert("Order failed");

    }
  };

  return (

    <div className="min-h-screen bg-[#f5f7f2] p-10">

      <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-8">

        {/* LEFT */}
        <div className="bg-white p-8 rounded-3xl shadow-sm">

          <h1 className="text-4xl font-bold text-green-900 mb-8">
            Checkout 💳
          </h1>

          <div className="space-y-5">

            <div>

              <label className="block mb-2 font-semibold">
                Full Name
              </label>

              <input
                type="text"
                placeholder="Enter name"
                className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Delivery Address
              </label>

              <textarea
                rows="4"
                placeholder="Enter address"
                className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
              />

            </div>

            <div>

              <label className="block mb-2 font-semibold">
                Payment Method
              </label>

              <select
                className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
              >
                <option>UPI</option>
                <option>Card</option>
                <option>Cash on Delivery</option>
              </select>

            </div>

            <button
              onClick={handlePlaceOrder}
              className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl text-lg font-semibold"
            >
              Place Order
            </button>

          </div>

        </div>

        {/* RIGHT */}
        <div className="bg-white p-8 rounded-3xl shadow-sm h-fit">

          <h2 className="text-3xl font-bold mb-6">
            Order Summary 🛒
          </h2>

          <div className="space-y-4">

            {cart.map((item) => (

              <div
                key={item.cart_id}
                className="flex items-center justify-between border-b pb-4"
              >

                <div>

                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-gray-500">
                    Qty: {item.quantity}
                  </p>

                </div>

                <p className="font-bold text-green-700">
                  ₹{item.price}
                </p>

              </div>

            ))}

          </div>

          <div className="mt-8 flex items-center justify-between text-2xl font-bold">

            <span>Total</span>

            <span className="text-green-700">
              ₹{total}
            </span>

          </div>

        </div>

      </div>
    </div>
  );
}

export default Checkout;