// src/pages/ViewDownloadReport.jsx
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./viewDownloadReport.css";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

function buildQuery(params) {
  const sp = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && String(v).trim() !== "")
      sp.set(k, String(v).trim());
  });
  return sp.toString();
}

export default function ViewDownloadReport() {
  const nav = useNavigate();
  const loc = useLocation();

  // ✅ Back target:
  // 1) state: nav("/view-download-report", { state: { backTo: "/admin" } })
  // 2) query: /view-download-report?from=admin  (or operations)
  // 3) fallback: history back, else /admin
  const backTo = (() => {
    const st = loc.state || {};
    if (typeof st.backTo === "string" && st.backTo.trim()) return st.backTo.trim();

    const sp = new URLSearchParams(loc.search || "");
    const from = (sp.get("from") || "").toLowerCase();
    if (from === "operations" || from === "ops") return "/operations";
    if (from === "admin") return "/admin";

    return null;
  })();

  const handleBack = () => {
    if (backTo) return nav(backTo);
    if (window.history.length > 1) return nav(-1);
    return nav("/admin");
  };

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [limit, setLimit] = useState(200);

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

  const cols = useMemo(
    () => [
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

  const clearFilters = () => {
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
    });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="vr-page">
      <div className="vr-shell">
        <div className="vr-header">
          <div>
            <div className="vr-kicker">Reports</div>
            <h1 className="vr-title">View / Download Report</h1>
          </div>

          <div className="vr-actions">
            <button className="vr-btn-ghost" type="button" onClick={handleBack}>
              Back
            </button>

            <button className="vr-btn-ghost" onClick={fetchData} disabled={loading}>
              {loading ? "Loading..." : "Apply Filters"}
            </button>
            <button className="vr-btn-primary" onClick={downloadExcel}>
              Download Excel
            </button>
          </div>
        </div>

        <div className="vr-card">
          <div className="vr-grid">
            {filterList.map((f) => (
              <div key={f.key} className={`vr-field ${f.key === "description" ? "span-2" : ""}`}>
                <label>{f.label}</label>
                <input
                  type={f.type || "text"}
                  value={filters[f.key]}
                  onChange={(e) => setFilters((p) => ({ ...p, [f.key]: e.target.value }))}
                  placeholder={f.type === "date" ? "YYYY-MM-DD" : ""}
                />
              </div>
            ))}

            <div className="vr-field">
              <label>Max Rows (view)</label>
              <input
                type="number"
                min={1}
                max={2000}
                value={limit}
                onChange={(e) => setLimit(Number(e.target.value || 200))}
              />
            </div>

            <div className="vr-field">
              <label>Quick Reset</label>
              <button className="vr-btn-ghost" type="button" onClick={clearFilters}>
                Clear Filters
              </button>
            </div>
          </div>

          <div className="vr-meta">
            <div>
              Rows: <b>{rows.length}</b>
            </div>
            <div className="vr-tip">
              Tip: Use Company/Username/Location/Status for fast filtering. Refresh page to reset tables.
            </div>
          </div>

          {err ? <div className="vr-message err">{err}</div> : null}
        </div>

        <div className="vr-tablewrap">
          <table className="vr-table">
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c.key}>{c.label}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.id ?? `${r.ticket_number}-${idx}`}>
                  {cols.map((c) => (
                    <td key={c.key} title={String(r?.[c.key] ?? "")}>
                      {String(r?.[c.key] ?? "")}
                    </td>
                  ))}
                </tr>
              ))}

              {rows.length === 0 && !loading ? (
                <tr>
                  <td colSpan={cols.length} className="vr-empty">
                    No data found for the selected filters.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
