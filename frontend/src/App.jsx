import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import StockList from "./pages/Inventory/StockList";
import AddItem from "./pages/Inventory/AddItem";
import EditItem from "./pages/Inventory/EditItem";
import Categories from "./pages/Inventory/Categories";
import SalesList from "./pages/Sales/SalesList";
import CreateSale from "./pages/Sales/CreateSale";
import Reports from "./pages/Reports/Reports";
import { AuthProvider, RequireAuth } from "./lib/auth";
import Login from "./pages/Login";

export default function App() {
  return (
    <AuthProvider>
      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-1 p-6 overflow-auto">
          <Routes>
            <Route
              path="/login"
              element={
                <Login
                  onLogin={(u) => {
                    /* no-op */
                  }}
                />
              }
            />
            <Route
              path="/"
              element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              }
            />
            <Route
              path="/inventory"
              element={
                <RequireAuth>
                  <StockList />
                </RequireAuth>
              }
            />
            <Route
              path="/inventory/add"
              element={
                <RequireAuth>
                  <AddItem />
                </RequireAuth>
              }
            />
            <Route
              path="/inventory/edit/:id"
              element={
                <RequireAuth>
                  <EditItem />
                </RequireAuth>
              }
            />
            <Route
              path="/inventory/categories"
              element={
                <RequireAuth>
                  <Categories />
                </RequireAuth>
              }
            />
            <Route
              path="/sales"
              element={
                <RequireAuth>
                  <SalesList />
                </RequireAuth>
              }
            />
            <Route
              path="/sales/create"
              element={
                <RequireAuth>
                  <CreateSale />
                </RequireAuth>
              }
            />
            <Route
              path="/reports"
              element={
                <RequireAuth>
                  <Reports />
                </RequireAuth>
              }
            />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  );
}
