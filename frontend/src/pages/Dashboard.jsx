import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, Legend } from "recharts";
import StatCard from "../components/StatCard";
import LowStockList from "../components/LowStockList";
import api from "../lib/mockApi";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Dashboard() {
  const [items, setItems] = useState([]);

  useEffect(() => {
    // Use API helper which returns parsed data
    api
      .getItems()
      .then((data) => setItems(data))
      .catch((error) => console.error("Failed to fetch items:", error));
  }, []);

  // Diyaarso pie chart data
  const map = {};
  items.forEach((it) => {
    map[it.category] = (map[it.category] || 0) + 1;
  });
  const pieData = Object.keys(map).map((k) => ({ name: k, value: map[k] }));

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2 white-card">
          <h3 className="font-semibold mb-2">Inventory Distribution</h3>
          <div className="flex justify-center">
            <PieChart width={360} height={260}>
              <Pie
                data={pieData}
                dataKey="value"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label
              >
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </div>
        </div>

        <div className="space-y-4">
          <StatCard title="Total Items" value={items.length} />
          <StatCard
            title="In Stock"
            value={items.filter((i) => i.stock > 0).length}
          />
          <StatCard
            title="Low Stock"
            value={items.filter((i) => i.stock > 0 && i.stock < 5).length}
          />
        </div>

        <div className="lg:col-span-3">
          <LowStockList items={items} />
        </div>
      </div>
    </div>
  );
}
