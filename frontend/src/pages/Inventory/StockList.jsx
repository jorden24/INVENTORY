import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../lib/mockApi";
import AddItem from "./AddItem";

export default function StockList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .get("/")
      .then((r) => setItems(r.data))
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  return (
    <div className="p-6">
    
      <div className="bg-white rounded-lg shadow p-6">
        
        <h2 className="text-xl font-semibold mb-4">Stock List</h2>
        <table className="w-full table-auto border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2 text-left">Item Name</th>
              <th className="border px-4 py-2 text-left">Category</th>
              <th className="border px-4 py-2 text-left">Stock</th>
              <th className="border px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item._id}>
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">{item.category}</td>
                <td className="border px-4 py-2">{item.stock}</td>
                <td className="border px-4 py-2">
                  <Link
                    to={`/inventory/edit/${item._id}`}
                    className="text-blue-500 hover:underline"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
