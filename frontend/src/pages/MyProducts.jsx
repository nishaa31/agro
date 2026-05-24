import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import Sidebar from "../components/Sidebar";

function MyProducts() {

  const [products, setProducts] = useState([]);

  const farmerId = localStorage.getItem("userId");

  // 🔥 FETCH PRODUCTS
  useEffect(() => {

    fetch("http://localhost:8000/products")
      .then((res) => res.json())
      .then((data) => {

        // only farmer products
        const filtered = data.filter(
          (item) =>
            item.farmer_id == farmerId
        );

        setProducts(filtered);

      })
      .catch((err) => {
        console.log(err);
      });

  }, []);

  // 🔥 DELETE PRODUCT
  const handleDelete = async (id) => {

    try {

      await fetch(
        `http://localhost:8000/delete-product/${id}`,
        {
          method: "DELETE",
        }
      );

      setProducts(
        products.filter(
          (item) => item.id !== id
        )
      );

      alert("Product deleted");

    } catch (err) {

      console.log(err);
      alert("Delete failed");

    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-[#f4f7f2] p-6 overflow-auto">

      <div className="flex items-center justify-between mb-8">

        <h1 className="text-4xl font-bold text-green-900">
          My Products 🌾
        </h1>

      </div>

      {products.length === 0 ? (

        <div className="bg-white p-10 rounded-3xl text-center shadow-sm">

          <h2 className="text-2xl font-semibold text-gray-700 mb-3">
            No Products Added
          </h2>

          <p className="text-gray-500">
            Start adding products to sell.
          </p>

        </div>

      ) : (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {products.map((product) => (

            <div
              key={product.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition"
            >

              <img
                src={
                  product.image ||
                  "https://via.placeholder.com/400"
                }
                alt={product.name}
                className="h-56 w-full object-cover"
              />

              <div className="p-5">

                <div className="flex items-start justify-between mb-3">

                  <div>

                    <h2 className="text-2xl font-bold text-gray-900">
                      {product.name}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {product.category}
                    </p>

                  </div>

                  <button
                    onClick={() =>
                      handleDelete(product.id)
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={22} />
                  </button>

                </div>

                <p className="text-green-700 font-bold text-xl mb-2">
                  ₹{product.price}
                </p>

                <p className="text-gray-600 mb-4">
                  {product.description}
                </p>

                <div className="bg-green-100 text-green-800 px-4 py-2 rounded-xl w-fit font-semibold">
                  Stock: {product.stock}
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

export default MyProducts;