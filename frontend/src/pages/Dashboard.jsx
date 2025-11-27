import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
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

  // Prepare pie chart data - use category name when available
  const map = {};
  items.forEach((it) => {
    const catName =
      (it.category && it.category.name) || it.category || "Uncategorized";
    map[catName] = (map[catName] || 0) + 1;
  });
  const pieData = Object.keys(map).map((k) => ({ name: k, value: map[k] }));

  // Additional chart data
  // Top 5 items by stock for BarChart
  const topItems = [...items]
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 5)
    .map((it) => ({ name: it.name, stock: it.stock || 0 }));

  // Simple line data: top 10 items by stock to show a trend-like series
  const lineData = [...items]
    .sort((a, b) => (b.stock || 0) - (a.stock || 0))
    .slice(0, 10)
    .map((it) => ({ name: it.name, stock: it.stock || 0 }));

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

          {/* New charts: Bar (top items) and Line (stock across items) */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="white-card p-4">
              <h4 className="font-semibold mb-2">Top Items by Stock</h4>
              <ResponsiveContainer
                width="100%"
                height={200}
                debounce={50}
                minWidth={300}
                minHeight={200}
              >
                <BarChart
                  data={topItems}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="stock" fill="#10b981" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="white-card p-4">
              <h4 className="font-semibold mb-2">Stock Trend (Top Items)</h4>
              <ResponsiveContainer
                width="100%"
                height={200}
                debounce={50}
                minWidth={300}
                minHeight={200}
              >
                <LineChart
                  data={lineData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="stock"
                    stroke="#4f46e5"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
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
