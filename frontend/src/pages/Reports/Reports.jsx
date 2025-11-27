import React, { useEffect, useState } from "react";
import api from "../../lib/mockApi";

function toCSV(rows) {
  if (rows.length === 0) return "";
  const keys = Object.keys(rows[0]);
  const lines = [keys.join(",")];
  for (const r of rows) {
    lines.push(
      keys.map((k) => `"${String(r[k]).replace(/"/g, '""')}"`).join(",")
    );
  }
  return lines.join("\n"); // FIXED multiline
}

export default function Reports() {
  const [from, setFrom] = useState(() =>
    new Date(Date.now() - 7 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );
  const [to, setTo] = useState(() => new Date().toISOString().slice(0, 10));
  const [sales, setSales] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    api.getItems().then(setItems);
    api.getSales().then(setSales);
  }, []);

  const runSalesReport = async () => {
    const fromIso = new Date(from).toISOString();
    const toIso = new Date(
      new Date(to).getTime() + 24 * 3600 * 1000 - 1
    ).toISOString();
    const res = await api.getSalesBetween(fromIso, toIso);
    setSales(res);
  };

  //   useEffect(() => {
  //     runSalesReport()
  //   }, []) // FIXED: added dependencies

  const downloadSalesCSV = () => {
    const rows = sales.map((s) => ({
      date: s.createdAt,
      total: s.total,
      note: s.note,
    }));
    const csv = toCSV(rows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sales_${from}_${to}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100); // FIXED: revoke after short delay
  };

  const inventoryRows = items.map((i) => ({
    name: i.name,
    category: (i.category && i.category.name) || i.category || "",
    stock: i.stock,
    price: i.price,
  }));
  const downloadInventoryCSV = () => {
    const csv = toCSV(inventoryRows);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inventory_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 100); // FIXED: revoke after short delay
  };

  const totalSalesValue = sales.reduce((s, x) => s + (x.total || 0), 0);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Report Card */}
        <div className="white-card">
          <h3 className="font-semibold mb-3">Sales Report</h3>
          <div className="flex gap-2 items-end">
            <div>
              <div className="text-sm text-gray-500">From</div>
              <input
                type="date"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div>
              <div className="text-sm text-gray-500">To</div>
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="p-2 border rounded"
              />
            </div>
            <div>
              <button
                onClick={runSalesReport}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                Run
              </button>
            </div>
            <div className="ml-auto">
              <button
                onClick={downloadSalesCSV}
                className="px-3 py-2 bg-green-600 text-white rounded"
              >
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="font-medium">
              Total Sales: ${totalSalesValue.toFixed(2)}
            </div>
            <ul className="mt-3 space-y-2">
              {sales.map((s) => (
                <li key={s._id} className="border p-2 rounded">
                  <div className="flex justify-between">
                    <div>{new Date(s.createdAt).toLocaleString()}</div>
                    <div className="font-bold">${s.total}</div>
                  </div>
                  <div className="text-sm text-gray-600">{s.note}</div>
                </li>
              ))}
              {sales.length === 0 && (
                <li className="text-gray-500">No sales in this range</li>
              )}
            </ul>
          </div>
        </div>

        {/* Inventory Report Card */}
        <div className="white-card">
          <h3 className="font-semibold mb-3">Inventory Report</h3>
          <div className="flex justify-between items-center mb-3">
            <div className="text-sm text-gray-500">
              Snapshot: {new Date().toLocaleString()}
            </div>
            <button
              onClick={downloadInventoryCSV}
              className="px-3 py-2 bg-green-600 text-white rounded"
            >
              Export CSV
            </button>
          </div>
          <table className="w-full table-auto">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Category</th>
                <th className="p-2 text-left">Stock</th>
                <th className="p-2 text-left">Price</th>
              </tr>
            </thead>
            <tbody>
              {inventoryRows.map((r, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{r.name}</td>
                  <td className="p-2">{r.category}</td>
                  <td className="p-2">{r.stock}</td>
                  <td className="p-2">${r.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
