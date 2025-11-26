import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Edit2 } from "lucide-react";
import api from "../../lib/mockApi";

export default function StockList() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    api
      .getItems()
      .then((data) => setItems(data))
      .catch((err) => console.error("Failed to fetch items:", err));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return
    try {
      await api.delete(`/items/${id}`)
      setItems((prev) => prev.filter((it) => it._id !== id))
    } catch (err) {
      console.error('Failed to delete item:', err)
      alert('Failed to delete item')
    }
  }

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold mb-4">Stock List</h2>

          <Link
            to="/inventory/add"
            className="bg-blue-600 text-white px-3 py-2 rounded"
          >
            New Inventory
          </Link>
        </div>
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
                  <div className="flex items-center gap-3">
                    <Link to={`/inventory/edit/${item._id}`} className="text-blue-500">
                      <Edit2 size={16} />
                    </Link>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label={`Delete ${item.name}`}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
