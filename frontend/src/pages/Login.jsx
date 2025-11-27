import { useState } from "react";
import api from "../lib/mockApi";
import { useAuth } from "../lib/auth";

export default function Login({ onLogin }) {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isRegister, setIsRegister] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const path = isRegister ? "/auth/register" : "/auth/login";
      const res = await api.post(path, { username, password });
      // store user_id in localStorage for now
      localStorage.setItem("user_id", res.user_id);
      localStorage.setItem("username", res.username);
      localStorage.setItem("token", res.token || "");
      login(res);
      onLogin && onLogin(res);
    } catch (err) {
      setError(err.response?.error || err.message || "Auth failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-12">
      <h2 className="text-2xl font-semibold mb-4">
        {isRegister ? "Register" : "Login"}
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full border px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm mb-1">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2"
          />
        </div>
        {error && <div className="text-red-600">{error}</div>}
        <div className="flex items-center gap-4">
          <button
            className="px-4 py-2 bg-blue-600 text-white"
            disabled={loading}
          >
            {loading
              ? isRegister
                ? "Registering..."
                : "Logging in..."
              : isRegister
              ? "Register"
              : "Login"}
          </button>
          <button
            type="button"
            className="text-sm text-gray-600"
            onClick={() => setIsRegister(!isRegister)}
          >
            {isRegister
              ? "Have an account? Login"
              : "Don't have an account? Register"}
          </button>
        </div>
      </form>
    </div>
  );
}
