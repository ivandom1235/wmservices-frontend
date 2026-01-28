// src/pages/EditTicket.jsx

import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./editTicket.css";

export default function EditTicket() {
  const nav = useNavigate();
  const loc = useLocation();

  // ✅ Back target:
  // 1) explicit: <Link to="/edit-ticket" state={{ backTo: "/operations" }} />
  // 2) query: /edit-ticket?from=operations
  // 3) fallback: history back, else /admin
  const backTo = (() => {
    const st = loc.state || {};
    if (typeof st.backTo === "string" && st.backTo.trim()) return st.backTo.trim();

    const sp = new URLSearchParams(loc.search || "");
    const from = (sp.get("from") || "").toLowerCase();
    if (from === "operations" || from === "ops") return "/operations";
    if (from === "admin") return "/admin";

    return null; // means: use nav(-1)
  })();

  const handleBack = () => {
    if (backTo) return nav(backTo);
    if (window.history.length > 1) return nav(-1);
    return nav("/admin");
  };

  const [ticketNumber, setTicketNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [ticket, setTicket] = useState(null);

  const fields = useMemo(
    () => [
      { key: "ticket_number", label: "Ticket Number", readOnly: true },
      { key: "company_name", label: "Company Name" },
      { key: "location", label: "Location" },
      { key: "customer_name", label: "Customer Name" },
      { key: "customer_contact_number", label: "Customer Contact Number" },
      { key: "customer_email_id", label: "Customer Email ID" },
      { key: "category", label: "Category" },
      { key: "request_type", label: "Request Type" },
      { key: "particulars", label: "Particulars" },
      { key: "description", label: "Description", type: "textarea" },
      { key: "mode_of_payment", label: "Mode of Payment" },
      { key: "service_charges", label: "Service Charges" },
      { key: "cost", label: "Cost" },
      { key: "status", label: "Status" },
      { key: "due_date", label: "Due Date", type: "datetime-local" },
      { key: "due_duration_text", label: "Due Duration Text" },
    ],
    []
  );

  const toDatetimeLocal = (v) => {
    if (!v) return "";
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    const pad = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
      d.getHours()
    )}:${pad(d.getMinutes())}`;
  };

  const normalizeFromApi = (t) => ({ ...t, due_date: toDatetimeLocal(t?.due_date) });

  const findTicket = async (e) => {
    e?.preventDefault?.();
    setMsg("");
    setTicket(null);

    const tn = (ticketNumber || "").trim();
    if (!tn) return setMsg("Enter a ticket number.");

    setLoading(true);
    try {
      const data = await apiFetch(`/api/tickets/${encodeURIComponent(tn)}`);
      setTicket(normalizeFromApi(data.ticket));
      setMsg("Ticket loaded.");
    } catch (err) {
      setMsg(err?.message || "Ticket not found.");
      setTicket(null);
    } finally {
      setLoading(false);
    }
  };

  const onChangeField = (key, value) => setTicket((p) => ({ ...(p || {}), [key]: value }));

  const saveTicket = async (e) => {
    e?.preventDefault?.();
    if (!ticket?.ticket_number) return setMsg("Load a ticket first.");

    setMsg("");
    setSaving(true);
    try {
      const payload = { ...ticket };

      if (payload.due_date) {
        const d = new Date(payload.due_date);
        if (!Number.isNaN(d.getTime())) {
          const pad = (n) => String(n).padStart(2, "0");
          payload.due_date = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(
            d.getDate()
          )} ${pad(d.getHours())}:${pad(d.getMinutes())}:00`;
        }
      }

      const data = await apiFetch(`/api/tickets/${encodeURIComponent(ticket.ticket_number)}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });

      setTicket(normalizeFromApi(data.ticket));
      setMsg("Ticket updated successfully.");
    } catch (err) {
      setMsg(err?.message || "Update failed.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="et-page">
      <div className="et-shell">
        <div className="et-header">
          <div>
            <div className="et-kicker">Tickets</div>
            <h1 className="et-title">Edit Ticket</h1>
          </div>

          <button className="et-btn-ghost" type="button" onClick={handleBack}>
            Back
          </button>
        </div>

        <div className="et-card">
          <form onSubmit={findTicket} className="et-row">
            <div className="et-field">
              <label>Ticket Number</label>
              <input
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
                placeholder="Search by Ticket Number (e.g., WMS123)"
              />
            </div>

            <button className="et-btn-soft" type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </form>

          {msg ? <div className="et-message">{msg}</div> : null}
        </div>

        {ticket ? (
          <div className="et-card">
            <form onSubmit={saveTicket}>
              <div className="et-grid">
                {fields.map((f) => (
                  <div
                    key={f.key}
                    className={`et-field ${f.type === "textarea" ? "span-2" : ""}`}
                  >
                    <label>{f.label}</label>

                    {f.type === "textarea" ? (
                      <textarea
                        value={ticket?.[f.key] ?? ""}
                        onChange={(e) => onChangeField(f.key, e.target.value)}
                        readOnly={!!f.readOnly}
                        placeholder={`Enter ${f.label}`}
                      />
                    ) : (
                      <input
                        type={f.type || "text"}
                        value={ticket?.[f.key] ?? ""}
                        onChange={(e) => onChangeField(f.key, e.target.value)}
                        readOnly={!!f.readOnly}
                        placeholder={`Enter ${f.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>

              <div className="et-footer">
                <button className="et-btn-primary" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        ) : null}
      </div>
    </div>
  );
}
