import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("user_id");
    const username = localStorage.getItem("username");
    if (stored) setUser({ user_id: stored, username });
  }, []);

  const login = (payload) => {
    // payload expected to contain user_id and username
    localStorage.setItem("user_id", payload.user_id);
    localStorage.setItem("username", payload.username);
    setUser({ user_id: payload.user_id, username: payload.username });
    navigate("/");
  };

  const logout = () => {
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

// Component to protect routes
export function RequireAuth({ children }) {
  const { user } = useAuth();
  if (!user) {
    // Not authenticated
    return <NavigateToLogin />;
  }
  return children;
}

function NavigateToLogin() {
  // separate component to avoid using Navigate from react-router here (import would be fine too)
  // we'll use window.location to redirect
  if (typeof window !== "undefined") window.location.href = "/login";
  return null;
}
