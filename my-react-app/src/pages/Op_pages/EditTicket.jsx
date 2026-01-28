// src/pages/EditTicket.jsx
import { useMemo, useState } from "react";
import { apiFetch } from "../api";

export default function EditTicket() {
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

  const styles = {
    page: { padding: 24, maxWidth: 1100, margin: "0 auto" },
    title: { fontSize: 22, fontWeight: 700, margin: 0 },
    card: {
      marginTop: 14,
      border: "1px solid #222",
      borderRadius: 14,
      padding: 14,
      background: "rgba(255,255,255,0.03)",
    },
    row: { display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" },
    input: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #333",
      background: "rgba(0,0,0,0.25)",
      color: "#fff",
      outline: "none",
      minWidth: 260,
    },
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
    msg: { marginTop: 10, fontSize: 13, opacity: 0.9 },
    grid: { display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 },
    field: { display: "flex", flexDirection: "column", gap: 6 },
    label: { fontSize: 12, opacity: 0.8 },
    textarea: {
      padding: "10px 12px",
      borderRadius: 10,
      border: "1px solid #333",
      background: "rgba(0,0,0,0.25)",
      color: "#fff",
      outline: "none",
      minHeight: 110,
      resize: "vertical",
    },
  };

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>Edit Ticket</h1>

      <div style={styles.card}>
        <form onSubmit={findTicket} style={styles.row}>
          <input
            style={styles.input}
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="Search by Ticket Number (e.g., WMS123)"
          />
          <button style={styles.btn2} type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        {msg ? <div style={styles.msg}>{msg}</div> : null}
      </div>

      {ticket ? (
        <div style={styles.card}>
          <form onSubmit={saveTicket}>
            <div style={styles.grid}>
              {fields.map((f) => (
                <div key={f.key} style={styles.field}>
                  <div style={styles.label}>{f.label}</div>
                  {f.type === "textarea" ? (
                    <textarea
                      style={styles.textarea}
                      value={ticket?.[f.key] ?? ""}
                      onChange={(e) => onChangeField(f.key, e.target.value)}
                      readOnly={!!f.readOnly}
                    />
                  ) : (
                    <input
                      style={styles.input}
                      type={f.type || "text"}
                      value={ticket?.[f.key] ?? ""}
                      onChange={(e) => onChangeField(f.key, e.target.value)}
                      readOnly={!!f.readOnly}
                    />
                  )}
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, display: "flex", gap: 10 }}>
              <button style={styles.btn} type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      ) : null}
    </div>
  );
}
