import { useState } from "react";
import Sidebar from "../components/Sidebar";

function AddProduct() {

  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    const farmer_id = localStorage.getItem("userId");

    try {

      const res = await fetch(
        "http://localhost:8000/add-product",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            farmer_id,
            name,
            category,
            price,
            stock,
            image,
            description,
          }),
        }
      );

      const data = await res.json();

      alert(data.message);

      setName("");
      setCategory("");
      setPrice("");
      setStock("");
      setImage("");
      setDescription("");

    } catch (err) {

      console.log(err);
      alert("Failed to add product");

    }
  };

  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 min-h-screen bg-[#f4f7f2] p-6 overflow-auto">

      <div className="max-w-3xl mx-auto bg-white p-8 rounded-3xl shadow-sm">

        <h1 className="text-4xl font-bold text-green-900 mb-8">
          Add Product 🌾
        </h1>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >

          {/* PRODUCT NAME */}
          <div>

            <label className="block mb-2 font-semibold">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
            />

          </div>

          {/* CATEGORY */}
          <div>

            <label className="block mb-2 font-semibold">
              Category
            </label>

            <input
              type="text"
              placeholder="Vegetables / Fruits / Rice"
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
            />

          </div>

          {/* PRICE */}
          <div>

            <label className="block mb-2 font-semibold">
              Price
            </label>

            <input
              type="number"
              placeholder="Enter price"
              value={price}
              onChange={(e) =>
                setPrice(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
            />

          </div>

          {/* STOCK */}
          <div>

            <label className="block mb-2 font-semibold">
              Stock Quantity
            </label>

            <input
              type="number"
              placeholder="Enter stock quantity"
              value={stock}
              onChange={(e) =>
                setStock(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
            />

          </div>

          {/* IMAGE */}
          <div>

            <label className="block mb-2 font-semibold">
              Image URL
            </label>

            <input
              type="text"
              placeholder="Paste image URL"
              value={image}
              onChange={(e) =>
                setImage(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
            />

          </div>

          {/* DESCRIPTION */}
          <div>

            <label className="block mb-2 font-semibold">
              Description
            </label>

            <textarea
              rows="4"
              placeholder="Enter description"
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
              className="w-full border border-gray-300 rounded-2xl p-4 outline-none"
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            className="w-full bg-green-700 hover:bg-green-800 text-white py-4 rounded-2xl text-lg font-semibold"
          >
            Add Product
          </button>

        </form>
      </div>
    </div>
    </div>
  );
}

export default AddProduct;