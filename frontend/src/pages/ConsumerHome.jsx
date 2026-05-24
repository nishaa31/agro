import { ShoppingCart, Search, User, Leaf } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ConsumerSidebar from "../components/ConsumerSidebar";

function ConsumerHome() {

  const navigate = useNavigate();

  const [products, setProducts] = useState([]);

  useEffect(() => {

  fetch("http://localhost:8000/products")
    .then((res) => res.json())
    .then((data) => {
      setProducts(data);
    })
    .catch((err) => {
      console.log(err);
    });

}, []);

  return (
    <div className="flex"> 
    <ConsumerSidebar />
    <div className="ml-[280px] w-full min-h-screen bg-[#f5f7f2] transition-all duration-300">

      {/* 🔥 NAVBAR */}
      <div className="bg-white px-8 py-5 flex items-center justify-between shadow-sm">

        <div className="flex items-center gap-3">
          <Leaf className="text-green-700" size={32} />
          <h1 className="text-3xl font-bold text-green-900">
            AgroPestro
          </h1>
        </div>

        {/* SEARCH */}
        <div className="bg-[#f3f4f6] px-4 py-3 rounded-xl flex items-center gap-3 w-[420px]">
          <Search size={20} className="text-gray-500" />

          <input
            type="text"
            placeholder="Search vegetables, fruits..."
            className="bg-transparent outline-none w-full"
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-6">

          <div className="relative cursor-pointer" onClick={() => navigate("/cart")}>
            <ShoppingCart size={26} className="text-gray-700" />

            <div className="absolute -top-2 -right-2 bg-green-700 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              2
            </div>
          </div>

          <div className="w-11 h-11 rounded-full bg-green-100 flex items-center justify-center">
            <User className="text-green-700" size={22} />
          </div>

        </div>
      </div>

      {/* 🔥 HERO SECTION */}
      <div className="px-8 py-8">

        <div className="bg-gradient-to-r from-green-800 to-green-600 rounded-3xl p-10 flex items-center justify-between overflow-hidden">

          <div className="max-w-xl">

            <div className="bg-green-100 text-green-800 w-fit px-4 py-2 rounded-full text-sm font-semibold mb-5">
              🌾 Fresh From Farmers
            </div>

            <h1 className="text-5xl font-bold text-white leading-tight mb-5">
              Buy Fresh Crops
              <br />
              Directly From Farmers
            </h1>

            <p className="text-green-100 text-lg mb-7">
              No middlemen. Fresh vegetables, greens,
              rice and fruits delivered directly from
              trusted local farmers.
            </p>

            <button className="bg-white text-green-800 px-7 py-4 rounded-2xl font-semibold text-lg hover:scale-105 transition">
              Shop Now
            </button>

          </div>

          <img
            src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?q=80&w=1200&auto=format&fit=crop"
            alt="farmer"
            className="w-[430px] rounded-3xl shadow-2xl hidden lg:block"
          />
        </div>
      </div>

      {/* 🔥 CATEGORIES */}
      <div className="px-8">

        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Categories
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-3">🥬</div>
            <h3 className="text-xl font-semibold">
              Vegetables
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-3">🍎</div>
            <h3 className="text-xl font-semibold">
              Fruits
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-3">🌾</div>
            <h3 className="text-xl font-semibold">
              Rice & Grains
            </h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-lg transition cursor-pointer">
            <div className="text-5xl mb-3">🥗</div>
            <h3 className="text-xl font-semibold">
              Organic Greens
            </h3>
          </div>

        </div>
      </div>

      {/* 🔥 PRODUCTS */}
      <div className="px-8 py-10">

        <div className="flex items-center justify-between mb-6">

          <h2 className="text-3xl font-bold text-gray-900">
            Popular Products
          </h2>

          <button className="text-green-700 font-semibold">
            View All →
          </button>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition"
            >

              <img
                src={product.image}
                alt={product.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h3>

                <p className="text-green-700 font-semibold text-lg mb-4">
                  {product.price}
                </p>

                <button
  onClick={async () => {

    const user_id =
      localStorage.getItem("userId");

    try {

      const res = await fetch(
        "http://localhost:8000/add-to-cart",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            user_id,
            product_id: product.id,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

    } catch (err) {

      console.log(err);
      alert("Failed to add to cart");

    }

  }}
  className="w-full bg-green-700 hover:bg-green-800 text-white py-3 rounded-2xl font-semibold transition"
>
  Add to Cart
</button>

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  </div>
  );
}

export default ConsumerHome;