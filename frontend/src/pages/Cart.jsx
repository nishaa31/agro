import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Cart() {

  const navigate = useNavigate();

  const [cart, setCart] = useState([]);

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

  return (

    <div className="min-h-screen bg-[#f5f7f2] p-10">

      <h1 className="text-4xl font-bold text-green-900 mb-8">
        My Cart 🛒
      </h1>

      {cart.length === 0 ? (

        <div className="bg-white p-10 rounded-3xl text-center">

          <h2 className="text-2xl font-semibold mb-2">
            Cart is Empty
          </h2>

          <p className="text-gray-500">
            Add products to cart.
          </p>

        </div>

      ) : (

        <div className="space-y-5">

          {cart.map((item) => (

            <div
              key={item.cart_id}
              className="bg-white rounded-3xl p-5 flex items-center gap-5 shadow-sm"
            >

              <img
                src={item.image}
                alt={item.name}
                className="w-32 h-32 rounded-2xl object-cover"
              />

              <div className="flex-1">

                <h2 className="text-2xl font-bold">
                  {item.name}
                </h2>

                <p className="text-green-700 text-xl font-semibold mt-2">
                  ₹{item.price}
                </p>

                <p className="text-gray-500 mt-1">
                  Quantity: {item.quantity}
                </p>

              </div>

            </div>

          ))}

          <div className="bg-green-700 text-white p-6 rounded-3xl mt-8">

            <h2 className="text-3xl font-bold">
              Total: ₹{total}
            </h2>

            <button
  onClick={() => navigate("/checkout")}
  className="mt-5 bg-white text-green-700 px-6 py-3 rounded-2xl font-semibold"
>
  Proceed to Checkout
</button>

          </div>

        </div>

      )}

    </div>
  );
}

export default Cart;