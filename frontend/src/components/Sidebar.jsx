import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../lib/auth";

export default function Sidebar() {
  const { user, logout } = useAuth() || {};
  const links = [
    { to: "/", label: "Dashboard" },
    { to: "/inventory", label: "Inventory" },
    { to: "/sales", label: "Sales" },
    { to: "/reports", label: "Reports" },
  ];
  return (
    <aside className="w-64 bg-[#071330] text-white p-5 flex flex-col gap-6">
      <div className="text-xl font-bold">Inventory system management</div>
      <nav className="flex flex-col gap-1">
        {links.map((l) => (
          <NavLink
            key={l.to}
            to={l.to}
            className={({ isActive }) =>
              `p-2 rounded ${isActive ? "bg-blue-600" : "hover:bg-white/5"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto text-sm opacity-70">v1.0 - Static UI</div>
      {user && (
        <div className="mt-4">
          <div className="text-sm">
            Signed in as <strong>{user.username || user}</strong>
          </div>
          <button
            className="mt-2 px-3 py-1 bg-red-600 rounded"
            onClick={() => logout()}
          >
            Logout
          </button>
        </div>
      )}
    </aside>
  );
}
