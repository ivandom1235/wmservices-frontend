// src/pages/OperationsLogin.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./operationslogin.css";

export default function OperationsLogin() {
  const nav = useNavigate();

  const [form, setForm] = useState({ username: "", password: "" });
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      await apiFetch("/api/operations/login", {
        method: "POST",
        body: JSON.stringify(form),
      });

      nav("/operations");
    } catch (err) {
      setMsg(err?.message || "Invalid username or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ops-login-page">
      <div className="login-container">
        <h2>Operations Login</h2>

        <form onSubmit={submit}>
          <label>Username</label>
          <input
            name="username"
            placeholder="Enter username"
            value={form.username}
            onChange={onChange}
            autoComplete="username"
            required
          />

          <label>Password</label>
          <input
            name="password"
            placeholder="Enter password"
            type="password"
            value={form.password}
            onChange={onChange}
            autoComplete="current-password"
            required
          />

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>

          {msg ? <div className="message">{msg}</div> : null}
        </form>
      </div>
    </div>
  );
}
