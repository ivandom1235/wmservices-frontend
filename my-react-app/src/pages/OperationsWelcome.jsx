// src/pages/OperationsWelcome.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./operationswelcome.css";

function getCookie(name) {
  const s = `; ${document.cookie}`;
  const parts = s.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return "";
}

export default function OperationsWelcome() {
  const nav = useNavigate();
  const [name, setName] = useState(() =>
    decodeURIComponent(getCookie("ops_name") || "")
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const me = await apiFetch("/api/operations/me");
        setName(me?.name || name || "");
      } catch {
        nav("/operations-login");
      } finally {
        setLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (loading) {
    return <div className="ops-welcome-loading">Loading...</div>;
  }

  return (
    <div className="ops-welcome-page">
      <div className="ops-shell">
        <div className="ops-header">
          <div>
            <div className="ops-kicker">Operations Console</div>
            <h2 className="ops-title">
              Welcome{ name ? `, ${name}` : "" }
            </h2>
          </div>

          <button
            className="btn-ghost"
            onClick={() => nav("/operations-login")}
          >
            Logout
          </button>
        </div>

        <div className="ops-card">
          <h3>Quick Actions</h3>
          <p className="ops-subtitle">
            Manage tickets and operational workflows
          </p>

          <div className="ops-actions">
            <button
              className="btn-soft"
              onClick={() => nav("/operations/tickets/view")}
            >
              View Tickets
            </button>

            <button
              className="btn-soft"
              onClick={() => nav("/operations/tickets/edit")}
            >
              Edit Tickets
            </button>

            <button
              className="btn-soft"
              onClick={() => nav("/operations/tickets/reports")}
            >
              View Report
            </button>

            <button
              className="btn-primary"
              onClick={() => nav("/operations/tickets/status")}
            >
              Change Ticket Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
