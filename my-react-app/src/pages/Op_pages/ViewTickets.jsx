// src/pages/ViewTickets.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function ViewTickets() {
  const nav = useNavigate();

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
        credentials: "include",
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
    <div style={{ padding: 40 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
        <h2 style={{ margin: 0 }}>Ticket Status</h2>

        <button className="vr-btn-ghost" type="button" onClick={() => nav(-1)}>
          Back
        </button>
      </div>

      <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by Ticket Number..."
          style={{
            width: 320,
            padding: "10px 12px",
            borderRadius: 8,
            border: "1px solid #ccc",
          }}
        />
        <button onClick={fetchTickets} disabled={loading}>
          {loading ? "Searching..." : "Search / Refresh"}
        </button>
        {query && (
          <button onClick={() => setQuery("")} disabled={loading}>
            Clear
          </button>
        )}
      </div>

      {err && (
        <div style={{ marginTop: 16, color: "crimson" }}>
          <strong>Error:</strong> {err}
        </div>
      )}

      <div style={{ marginTop: 20 }}>
        <div style={{ marginBottom: 10, color: "#555" }}>
          Showing <strong>{filtered.length}</strong> tickets
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 900 }}>
            <thead>
              <tr>
                {[
                  "Ticket Number",
                  "customer_name",
                  "Particulars",
                  "Description",
                  "Due Date",
                  "Created At",
                  "Status",
                  "Due Duration",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "10px 12px",
                      borderBottom: "2px solid #ddd",
                      background: "#fafafa",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: 14 }}>
                    Loading...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ padding: 14 }}>
                    No tickets found.
                  </td>
                </tr>
              ) : (
                filtered.map((t) => (
                  <tr key={t.id || t.ticket_number}>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                      {t.ticket_number}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                      {t.customer_name}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                      {t.particulars}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                      {t.description}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>
                      {t.due_date ? new Date(t.due_date).toLocaleString() : "-"}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee", whiteSpace: "nowrap" }}>
                      {t.created_at ? new Date(t.created_at).toLocaleString() : "-"}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                      {t.status}
                    </td>
                    <td style={{ padding: "10px 12px", borderBottom: "1px solid #eee" }}>
                      {t.due_duration_text || "-"}
                    </td>
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
