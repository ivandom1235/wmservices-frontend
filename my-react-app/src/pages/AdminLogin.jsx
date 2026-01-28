// src/pages/AdminLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./adminlogin.css";

export default function AdminLogin() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);
    try {
      await apiFetch("/api/admin/login", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });
      nav("/admin");
    } catch (err) {
      setMsg(err?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="login-container">
        <h2>Admin Login</h2>

        <form onSubmit={onSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            placeholder="Enter admin username"
            required
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            placeholder="Enter password"
            required
          />

          <button className="login-btn" disabled={loading} type="submit">
            {loading ? "Signing in..." : "Login"}
          </button>

          {msg ? <div className="message">{msg}</div> : null}
        </form>
      </div>
    </div>
  );
}
