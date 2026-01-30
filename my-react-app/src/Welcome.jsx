// src/pages/Welcome.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./welcome.css";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function Welcome() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const res = await fetch(`${API_BASE}/api/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          nav("/");
          return;
        }

        const data = await res.json();
        setUser(data?.user || null);
      } catch (e) {
        setErr(e?.message || "Failed to load user");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return (
      <div className="welcome-page">
        <div className="welcome-container">
          <h2 className="welcome-title">Loading...</h2>
          <p className="welcome-subtitle">Fetching your profile</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="welcome-page">
        <div className="welcome-container">
          <h2 className="welcome-title">Unauthorized</h2>

          {err && (
            <div className="welcome-error">
              <strong>Error:</strong> {err}
            </div>
          )}

          <button className="welcome-btn" onClick={() => nav("/")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="welcome-page">
      <div className="welcome-container">
        <div className="welcome-header">
          <div className="welcome-header-left">
            <h1 className="welcome-heading">Welcome, {user.username}</h1>
            <div className="welcome-meta">
              <span className="welcome-pill">
                <span className="dot" />
                Location: {user.location || "-"}
              </span>
            </div>
          </div>

          <button
            className="welcome-btn welcome-btn-ghost"
            onClick={async () => {
              try {
                await fetch(`${API_BASE}/api/logout`, {
                  method: "POST",
                  credentials: "include",
                });
              } finally {
                nav("/");
              }
            }}
          >
            Logout
          </button>
        </div>

        <div className="welcome-actions">
          <button className="welcome-btn" onClick={() => nav("/raise-ticket")}>
            Raise Ticket
          </button>

          <button
            className="welcome-btn welcome-btn-secondary"
            onClick={() => nav("/ticket-status")}
          >
            Ticket Status
          </button>

          <button
            className="welcome-btn welcome-btn-secondary"
            onClick={() => nav("/view-download-report?from=user")}
          >
            My Report
          </button>
        </div>

        <div className="welcome-hint">
          Tip: Use <b>Ticket Status</b> to track your request using ticket number.
        </div>
      </div>
    </div>
  );
}
