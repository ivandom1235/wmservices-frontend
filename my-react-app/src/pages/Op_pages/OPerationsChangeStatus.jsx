// src/pages/OperationsChangeStatus.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../../api";
import "./operationsChangeStatus.css";

const STATUSES = [
  "registered",
  "in_progress",
  "completed",
  "not_completed",
  "cancelled",
  "delayed",
];

export default function OperationsChangeStatus() {
  const nav = useNavigate();

  const [ticketNumber, setTicketNumber] = useState("");
  const [status, setStatus] = useState("in_progress");
  const [opRemark, setOpRemark] = useState("");
  const [msg, setMsg] = useState({ type: "", text: "" });
  const [ticket, setTicket] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loadingTicket, setLoadingTicket] = useState(false);

  const loadTicket = async () => {
    setMsg({ type: "", text: "" });
    setTicket(null);

    const tn = ticketNumber.trim();
    if (!tn) return setMsg({ type: "err", text: "Enter ticket number" });

    setLoadingTicket(true);
    try {
      const res = await apiFetch(`/api/tickets/${encodeURIComponent(tn)}`);
      setTicket(res.ticket);
      setStatus(res.ticket?.status || "in_progress");
      setOpRemark(res.ticket?.op_remark || "");
      setMsg({ type: "ok", text: "Ticket loaded" });
    } catch (e) {
      setMsg({ type: "err", text: e.message || "Failed to load ticket" });
    } finally {
      setLoadingTicket(false);
    }
  };

  const save = async () => {
  setMsg({ type: "", text: "" });

  const tn = ticketNumber.trim();
  if (!tn) return setMsg({ type: "err", text: "Enter ticket number" });

  let receiptNo = null;

  try {
    if (status === "completed") {
      const receipt = window.prompt("Enter Receipt No (stored internally):");
      if (receipt === null) return;

      receiptNo = String(receipt || "").trim();
      if (!receiptNo) {
        return setMsg({ type: "err", text: "Receipt No required." });
      }
    }

    setSaving(true);

    const res = await apiFetch(
      `/api/tickets/${encodeURIComponent(tn)}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({
          status,
          opRemarks: opRemark, // goes in email
          receiptNo: receiptNo, // stored in remark column
        }),
      }
    );

    setTicket(res.ticket);
    setMsg({ type: "ok", text: "Status updated successfully" });
  } catch (e) {
    setMsg({ type: "err", text: e.message || "Failed to update status" });
  } finally {
    setSaving(false);
  }
};


  return (
    <div className="ocs-page">
      <div className="ocs-shell">
        <div className="ocs-header">
          <div>
            <div className="ocs-kicker">Operations</div>
            <h1 className="ocs-title">Change Ticket Status</h1>
          </div>

          <div className="ocs-actions">
            <button className="ocs-btn-ghost" type="button" onClick={() => nav(-1)}>
              ← Back
            </button>
          </div>
        </div>

        <div className="ocs-card">
          <div className="ocs-grid">
            <div className="ocs-field span-2">
              <label>Ticket Number</label>
              <input
                placeholder="Ticket Number (e.g., WMS123)"
                value={ticketNumber}
                onChange={(e) => setTicketNumber(e.target.value)}
              />
            </div>

            <div className="ocs-field">
              <label>&nbsp;</label>
              <button
                className="ocs-btn-primary full"
                type="button"
                onClick={loadTicket}
                disabled={loadingTicket}
              >
                {loadingTicket ? "Loading..." : "Load Ticket"}
              </button>
            </div>
          </div>

          {msg.text ? <div className={`ocs-message ${msg.type}`}>{msg.text}</div> : null}
        </div>

        {ticket ? (
          <div className="ocs-card">
            <div className="ocs-summary">
              <div className="ocs-pill">
                <span className="k">Ticket</span>
                <span className="v">{ticket.ticket_number}</span>
              </div>
              <div className="ocs-pill">
                <span className="k">Customer</span>
                <span className="v">{ticket.customer_name}</span>
              </div>
              <div className="ocs-pill">
                <span className="k">Current Status</span>
                <span className="v">{ticket.status}</span>
              </div>
            </div>

            <div className="ocs-grid ocs-grid-2">
              <div className="ocs-field">
                <label>New Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="ocs-field span-2">
                <label>OP Remark</label>
                <textarea
                  rows={4}
                  value={opRemark}
                  onChange={(e) => setOpRemark(e.target.value)}
                  placeholder="Add notes / reason / next steps..."
                />
              </div>
            </div>

            <button
              className="ocs-btn-primary full"
              type="button"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Update Status"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
