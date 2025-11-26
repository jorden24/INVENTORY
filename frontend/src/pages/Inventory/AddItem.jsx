import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/mockApi";

export default function AddItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [category, setCategory] = useState("Electronics");
  const [cats, setCats] = useState([]);
  const nav = useNavigate();

  useEffect(() => {
    api.getCategories().then(setCats);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    console.log({ name, price, stock });

    await api.addItem({
      name,
      price: Number(price),
      stock: Number(stock),
      category,
    });
    nav("/inventory");
  };

  return (
    <div className="max-w-xl white-card">
      <h2 className="text-xl font-semibold mb-4">Add New Item</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Item name"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full p-2 border rounded"
        >
          {cats.map((c) => (
            <option key={c._id} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Price"
        />
        <input
          type="number"
          value={stock}
          onChange={(e) => setStock(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Stock"
        />
        <div className="flex gap-2">
          <button className="bg-blue-600 text-white px-4 py-2 rounded">
            Save
          </button>
          <button
            type="button"
            onClick={() => nav("/inventory")}
            className="px-4 py-2 border rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
