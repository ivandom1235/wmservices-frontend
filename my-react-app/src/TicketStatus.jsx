// src/pages/TicketStatus.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ticketStatus.css";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function TicketStatus() {
  const nav = useNavigate();

  const [authLoading, setAuthLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");

  async function ensureAuth() {
    try {
      const res = await fetch(`${API_BASE}/api/me`, {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        nav("/");
        return false;
      }

      return true;
    } catch {
      nav("/");
      return false;
    } finally {
      setAuthLoading(false);
    }
  }

  async function fetchTickets() {
    setLoading(true);
    setErr("");

    try {
      const url = new URL(`${API_BASE}/api/executive/tickets`);
      if (query.trim()) url.searchParams.set("ticketNumber", query.trim());

      const res = await fetch(url.toString(), {
        method: "GET",
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 401) {
          nav("/");
          return;
        }
        throw new Error(`Failed to load tickets (${res.status})`);
      }

      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      const ok = await ensureAuth();
      if (ok) fetchTickets();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) =>
      String(t.ticket_number || "").toLowerCase().includes(q)
    );
  }, [tickets, query]);

  if (authLoading) {
    return (
      <div className="ts-page">
        <div className="ts-container">
          <div className="ts-header">
            <h2 className="ts-title">Ticket Status</h2>
          </div>
          <p className="ts-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ts-page">
      <div className="ts-container">
        <div className="ts-header">
          <div className="ts-header-left">
            <h2 className="ts-title">Ticket Status</h2>
            <p className="ts-subtitle">
              Search and track your submitted service requests
            </p>
          </div>

          <div className="ts-header-actions">
            <button className="ts-btn ts-btn-secondary" onClick={() => nav("/welcome")}>
              Back
            </button>

            <button
              className="ts-btn ts-btn-ghost"
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
        </div>

        <div className="ts-toolbar">
          <div className="ts-search">
            <label className="ts-label" htmlFor="ticketQuery">
              Ticket Number
            </label>
            <input
              id="ticketQuery"
              className="ts-input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by Ticket Number..."
            />
          </div>

          <div className="ts-toolbar-actions">
            <button className="ts-btn" onClick={fetchTickets} disabled={loading}>
              {loading ? "Searching..." : "Search / Refresh"}
            </button>

            {query && (
              <button
                className="ts-btn ts-btn-secondary"
                onClick={() => {
                  setQuery("");
                  setTimeout(fetchTickets, 0);
                }}
                disabled={loading}
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {err && (
          <div className="ts-error">
            <strong>Error:</strong> {err}
          </div>
        )}

        <div className="ts-count">
          Showing <strong>{filtered.length}</strong> tickets
        </div>

        <div className="ts-table-wrap">
          <table className="ts-table">
            <thead>
              <tr>
                {[
                  "Ticket Number",
                  "Customer Name",
                  "Particulars",
                  "Description",
                  "Due Date",
                  "Created At",
                  "Status",
                  "Due Duration",
                ].map((h) => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="ts-td-muted">
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="ts-td-muted">
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id || t.ticket_number}>
                    <td className="ts-td-mono">{t.ticket_number}</td>
                    <td>{t.customer_name}</td>
                    <td>{t.particulars}</td>
                    <td className="ts-td-desc">{t.description}</td>
                    <td className="ts-td-nowrap">
                      {t.due_date ? new Date(t.due_date).toLocaleString() : "-"}
                    </td>
                    <td className="ts-td-nowrap">
                      {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}
                    </td>
                    <td>
                      <span className={`ts-status ts-status-${String(t.status || "")
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}>
                        {t.status}
                      </span>
                    </td>
                    <td>{t.due_duration_text || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
