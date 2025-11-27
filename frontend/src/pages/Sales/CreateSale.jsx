import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../lib/mockApi";

export default function CreateSale() {
  const [items, setItems] = useState([]);
  const [cart, setCart] = useState([]); // { itemId, qty }
  const [note, setNote] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    api.getItems().then(setItems);
  }, []);

  const addToCart = (item) => {
    const exists = cart.find((c) => c.itemId === item._id);
    if (exists)
      setCart(
        cart.map((c) => (c.itemId === item._id ? { ...c, qty: c.qty + 1 } : c))
      );
    else
      setCart([
        ...cart,
        { itemId: item._id, name: item.name, price: item.price, qty: 1 },
      ]);
  };

  const changeQty = (itemId, qty) => {
    setCart(
      cart.map((c) => (c.itemId === itemId ? { ...c, qty: Number(qty) } : c))
    );
  };

  const removeFromCart = (itemId) =>
    setCart(cart.filter((c) => c.itemId !== itemId));

  const total = cart.reduce((s, c) => s + c.qty * c.price, 0);

  const submit = async () => {
    if (cart.length === 0) return alert("Add at least one item");
    await api.addSale({
      items: cart.map((c) => ({ itemId: c.itemId, qty: c.qty })),
      note,
    });
    alert("Sale created");
    nav("/sales");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 white-card">
        <h2 className="text-xl font-semibold mb-3">Create Sale</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((it) => (
            <div
              key={it._id}
              className="border p-3 rounded flex justify-between items-center"
            >
              <div>
                <div className="font-medium">{it.name}</div>
                <div className="text-sm text-gray-500">
                  {(it.category && it.category.name) || it.category || ""} • $
                  {it.price} • Stock: {it.stock}
                </div>
              </div>
              <div>
                <button
                  disabled={it.stock <= 0}
                  onClick={() => addToCart(it)}
                  className={`px-3 py-1 rounded ${
                    it.stock <= 0 ? "bg-gray-300" : "bg-blue-600 text-white"
                  }`}
                >
                  {it.stock <= 0 ? "Out" : "Add"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <aside className="white-card">
        <h3 className="font-semibold mb-2">Cart</h3>
        <div className="space-y-2 max-h-72 overflow-auto">
          {cart.length === 0 && (
            <div className="text-gray-500">Cart is empty</div>
          )}
          {cart.map((c) => (
            <div
              key={c.itemId}
              className="flex justify-between items-center border p-2 rounded"
            >
              <div>
                <div className="font-medium">{c.name}</div>
                <div className="text-sm text-gray-500">${c.price}</div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={c.qty}
                  min={1}
                  onChange={(e) => changeQty(c.itemId, e.target.value)}
                  className="w-16 p-1 border rounded"
                />
                <button
                  onClick={() => removeFromCart(c.itemId)}
                  className="text-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <div className="text-sm text-gray-500">Note</div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full p-2 border rounded"
            rows={3}
          />
        </div>
        <div className="mt-3">
          <div className="text-lg font-bold mb-2">
            Total: ${total.toFixed(2)}
          </div>
          <button
            onClick={submit}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Complete Sale
          </button>
        </div>
      </aside>
    </div>
  );
}
