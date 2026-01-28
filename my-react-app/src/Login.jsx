// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();

  const [location, setLocation] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");



  const handleLogin = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      const res = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMsg(data.error || "Login failed.");
        return;
      }

      navigate("/welcome", { state: { user: data.user } });
    } catch {
      setMsg("Network error. Is the backend running?");
    }
  };

  return (
    <div className="login-page">
      <div className="top-actions">
        <button onClick={() => navigate("/admin/login")}>Admin Login</button>
        <button onClick={() => navigate("/operations-login")}>
          Operations Login
        </button>
      </div>

      <div className="login-container">
        <h2>Employee Login</h2>

        <form onSubmit={handleLogin}>

          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
          />

          <label>Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        {msg && <p className="message">{msg}</p>}
      </div>
    </div>
  );
}
