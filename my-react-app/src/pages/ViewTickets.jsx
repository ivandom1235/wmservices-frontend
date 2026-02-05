// src/pages/ViewTickets.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./viewticket.css";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function ViewTickets() {
  const nav = useNavigate();
  const loc = useLocation();

  const user = loc.state?.user;

  const backTo = (() => {
    const st = loc.state || {};
    if (typeof st.backTo === "string" && st.backTo.trim()) return st.backTo.trim();

    const sp = new URLSearchParams(loc.search || "");
    const from = (sp.get("from") || "").toLowerCase();
    if (from === "operations" || from === "ops") return "/operations";
    if (from === "admin") return "/admin";
    if (from === "welcome" || from === "executive") return "/welcome";

    return null;
  })();

  const handleBack = () => {
    if (backTo) return nav(backTo, user ? { state: { user } } : undefined);
    if (window.history.length > 1) return nav(-1);
    return nav("/welcome", user ? { state: { user } } : undefined);
  };

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [tickets, setTickets] = useState([]);
  const [query, setQuery] = useState("");

  async function fetchTickets() {
    setLoading(true);
    setErr("");
    try {
      const url = new URL(`${API_BASE}/api/tickets`);
      if (query.trim()) url.searchParams.set("ticketNumber", query.trim());

      const res = await fetch(url.toString(), {
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Failed to load tickets (${res.status})`);

      const data = await res.json();
      setTickets(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTickets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return tickets;
    return tickets.filter((t) =>
      String(t.ticket_number || "").toLowerCase().includes(q)
    );
  }, [tickets, query]);

  return (
    <div className="vt-page">
      <div className="vt-shell">
        <div className="vt-header">
          <div>
            <div className="vt-kicker">Tickets</div>
            <h2 className="vt-title">Ticket Status</h2>
          </div>

          <button className="vt-btn-ghost" type="button" onClick={handleBack}>
            Back
          </button>
        </div>

        <div className="vt-card">
          <div className="vt-controls">
            <div className="vt-field">
              <label>Search</label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by Ticket Number..."
              />
            </div>

            <div className="vt-actions">
              <button
                className="vt-btn-primary"
                onClick={fetchTickets}
                disabled={loading}
                type="button"
              >
                {loading ? "Searching..." : "Search / Refresh"}
              </button>

              {query ? (
                <button
                  className="vt-btn-soft"
                  onClick={() => {
                    setQuery("");
                    setTimeout(fetchTickets, 0);
                  }}
                  disabled={loading}
                  type="button"
                >
                  Clear
                </button>
              ) : null}
            </div>
          </div>

          {err ? (
            <div className="vt-message err">
              <strong>Error:</strong> {err}
            </div>
          ) : null}

          <div className="vt-meta">
            Showing <strong>{filtered.length}</strong> tickets
          </div>

          <div className="vt-table-wrap">
            <table className="vt-table">
              <thead>
                <tr>
                  {[
                    "Ticket Number",
                    "Company Name",
                    "Customer Name",
                    "Particulars",
                    "Description",
                    "Cost",
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
                    <td colSpan={9} className="vt-td-center">
                      Loading...
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="vt-td-center">
                      No tickets found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((t) => (
                    <tr key={t.id || t.ticket_number}>
                      <td className="mono">{t.ticket_number}</td>
                      <td>{t.company_name || "-"}</td>
                      <td>{t.customer_name || "-"}</td>
                      <td>{t.particulars || "-"}</td>
                      <td className="vt-desc">{t.description || "-"}</td>
                      <td>{t.cost || "-"}</td>
                      <td>{t.created_at ? new Date(t.created_at).toLocaleString() : "-"}</td>
                      <td>
                        <span className={`vt-pill ${String(t.status || "").toLowerCase()}`}>
                          {t.status || "-"}
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
    </div>
  );
}
