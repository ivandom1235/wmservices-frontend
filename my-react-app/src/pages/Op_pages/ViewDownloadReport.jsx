// src/pages/ViewDownloadReport.jsx
import { useEffect, useMemo, useState } from "react";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:5000";

function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "") sp.set(k, String(v).trim());
  });
  return sp.toString();
}

export default function ViewDownloadReport() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const [filters, setFilters] = useState({
    company_name: "",
    username: "",
    location: "",
    customer_name: "",
    category: "",
    request_type: "",
    status: "",
    due_from: "",
    due_to: "",
    created_from: "",
    created_to: "",
  });

  const [limit, setLimit] = useState(200);

  const filterList = useMemo(
    () => [
      { key: "company_name", label: "Company" },
      { key: "username", label: "Username" },
      { key: "location", label: "Location" },
      { key: "customer_name", label: "Customer Name" },
      { key: "category", label: "Category" },
      { key: "request_type", label: "Request Type" },
      { key: "status", label: "Status" },
      { key: "due_from", label: "Due Date From", type: "date" },
      { key: "due_to", label: "Due Date To", type: "date" },
      { key: "created_from", label: "Created From", type: "date" },
      { key: "created_to", label: "Created To", type: "date" },
    ],
    []
  );

  async function fetchData() {
    setLoading(true);
    setErr("");
    try {
      const qs = buildQuery({ ...filters, limit });
      const res = await fetch(`${API_BASE}/api/reports/tickets?${qs}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to fetch report.");
      setRows(Array.isArray(data?.rows) ? data.rows : []);
    } catch (e) {
      setErr(e?.message || "Error");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }

  async function downloadExcel() {
    setErr("");
    try {
      const qs = buildQuery({ ...filters });
      const res = await fetch(`${API_BASE}/api/reports/tickets/export?${qs}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Export failed.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `tickets_report_${new Date().toISOString().slice(0, 10)}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      setErr(e?.message || "Export error");
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const cols = useMemo(
    () => [
      // tickets.*
      { key: "ticket_number", label: "Ticket #" },
      { key: "company_name", label: "Company" },
      { key: "location", label: "Location" },
      { key: "customer_name", label: "Customer" },
      { key: "customer_contact_number", label: "Customer Phone" },
      { key: "customer_email_id", label: "Customer Email" },
      { key: "category", label: "Category" },
      { key: "request_type", label: "Request Type" },
      { key: "particulars", label: "Particulars" },
      { key: "description", label: "Description" },
      { key: "mode_of_payment", label: "Payment Mode" },
      { key: "service_charges", label: "Service Charges" },
      { key: "cost", label: "Cost" },
      { key: "status", label: "Status" },
      { key: "due_date", label: "Due Date" },
      { key: "created_at", label: "Ticket Created" },
      { key: "ticket_username", label: "Ticket Username" },

      // users.*
      { key: "user_id", label: "User ID" },
      { key: "user_username", label: "User Username" },
      { key: "user_name", label: "User Name" },
      { key: "user_location", label: "User Location" },
      { key: "exe_mobile_number", label: "Exec Mobile" },
      { key: "exe_company_name", label: "Exec Company" },
      { key: "exe_email", label: "Exec Email" },
      { key: "area", label: "Area" },
      { key: "designation", label: "Designation" },
      { key: "user_created_at", label: "User Created" },
    ],
    []
  );

  const styles = {
    page: { padding: 24, maxWidth: 1400, margin: "0 auto" },
    headerRow: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 },
    title: { fontSize: 22, fontWeight: 700, margin: 0 },
    actions: { display: "flex", gap: 10, alignItems: "center" },
    btn: {
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #333",
      background: "#111",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },
    btn2: {
      padding: "10px 14px",
      borderRadius: 10,
      border: "1px solid #333",
      background: "transparent",
      color: "#fff",
      cursor: "pointer",
      fontWeight: 600,
    },
    card: {
      marginTop: 16,
      border: "1px solid #222",
      borderRadius: 14,
      padding: 14,
      background: "rgba(255,255,255,0.03)",
    },
    grid: { display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 12 },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 12, opacity: 0.8 },
    input: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #333",
      background: "rgba(0,0,0,0.25)",
      color: "#fff",
      outline: "none",
    },
    tableWrap: { marginTop: 16, overflow: "auto", borderRadius: 14, border: "1px solid #222" },
    table: { width: "100%", borderCollapse: "collapse", minWidth: 1600 },
    th: {
      textAlign: "left",
      padding: "10px 12px",
      fontSize: 12,
      borderBottom: "1px solid #222",
      position: "sticky",
      top: 0,
      background: "#0b0b0b",
      zIndex: 1,
      whiteSpace: "nowrap",
    },
    td: { padding: "10px 12px", fontSize: 13, borderBottom: "1px solid #1a1a1a", whiteSpace: "nowrap" },
    meta: { marginTop: 10, fontSize: 12, opacity: 0.85, display: "flex", gap: 10, alignItems: "center" },
    error: { marginTop: 10, color: "#ffb4b4", fontSize: 13 },
  };

  return (
    <div style={styles.page}>
      <div style={styles.headerRow}>
        <h1 style={styles.title}>View / Download Report</h1>
        <div style={styles.actions}>
          <button style={styles.btn2} onClick={fetchData} disabled={loading}>
            {loading ? "Loading..." : "Apply Filters"}
          </button>
          <button style={styles.btn} onClick={downloadExcel}>
            Download Excel
          </button>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.grid}>
          {filterList.map((f) => (
            <div key={f.key} style={styles.field}>
              <div style={styles.label}>{f.label}</div>
              <input
                style={styles.input}
                type={f.type || "text"}
                value={filters[f.key]}
                onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.type === "date" ? "YYYY-MM-DD" : ""}
              />
            </div>
          ))}

          <div style={styles.field}>
            <div style={styles.label}>Max Rows (view)</div>
            <input
              style={styles.input}
              type="number"
              min={1}
              max={2000}
              value={limit}
              onChange={(e) => setLimit(Number(e.target.value || 200))}
            />
          </div>

          <div style={styles.field}>
            <div style={styles.label}>Quick Reset</div>
            <button
              style={styles.btn2}
              onClick={() =>
                setFilters({
                  company_name: "",
                  username: "",
                  location: "",
                  customer_name: "",
                  category: "",
                  request_type: "",
                  status: "",
                  due_from: "",
                  due_to: "",
                  created_from: "",
                  created_to: "",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        </div>

        <div style={styles.meta}>
          <div>
            Rows: <b>{rows.length}</b>
          </div>
          <div style={{ opacity: 0.7 }}>
            Tip: Use Company/Username/Location/Status for fast filtering. Use date filters for reporting.
          </div>
        </div>

        {err ? <div style={styles.error}>{err}</div> : null}
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr>
              {cols.map((c) => (
                <th key={c.key} style={styles.th}>
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, idx) => (
              <tr key={r.id ?? `${r.ticket_number}-${idx}`}>
                {cols.map((c) => (
                  <td key={c.key} style={styles.td} title={String(r?.[c.key] ?? "")}>
                    {String(r?.[c.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
            {rows.length === 0 && !loading ? (
              <tr>
                <td style={styles.td} colSpan={cols.length}>
                  No data found for the selected filters.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
