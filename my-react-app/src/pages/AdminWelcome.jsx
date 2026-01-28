// src/pages/AdminWelcome.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./adminwelcome.css";

export default function AdminWelcome() {
  const nav = useNavigate();
  const [me, setMe] = useState(null);

  const [showReset, setShowReset] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/api/admin/me");
        setMe(data.admin);
      } catch {
        nav("/admin/login");
      }
    })();
  }, [nav]);

  const logout = async () => {
    await apiFetch("/api/admin/logout", { method: "POST" });
    nav("/admin/login");
  };

  const changePassword = async (e) => {
    e.preventDefault();
    setMsg("");
    setSaving(true);
    try {
      await apiFetch("/api/admin/change-password", {
        method: "POST",
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      setCurrentPassword("");
      setNewPassword("");
      setMsg("Password updated successfully.");
      setShowReset(false);
    } catch (err) {
      setMsg(err?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-welcome-page">
      <div className="admin-shell">
        <div className="admin-header">
          <div>
            <div className="admin-kicker">Admin Console</div>
            <h2 className="admin-title">Welcome, {me?.username || "Admin"}</h2>
          </div>

          <button className="btn-ghost" onClick={logout}>
            Logout
          </button>
        </div>

        <div className="admin-card">
          <div className="card-title-row">
            <h3>Quick Actions</h3>
            <div className="card-subtitle">
              Manage tickets, executives, operations, and reports
            </div>
          </div>

          <div className="actions-grid">
            <button className="btn-soft" onClick={() => nav("/admin/tickets/view")}>
              View Ticket
            </button>
            <button className="btn-soft" onClick={() => nav("/admin/tickets/edit")}>
              Edit Ticket
            </button>
            <button className="btn-soft" onClick={() => nav("/admin/executives/add")}>
              Add Executive
            </button>
            <button className="btn-soft" onClick={() => nav("/admin/executives/edit")}>
              Edit Executive
            </button>
            <button className="btn-soft" onClick={() => nav("/admin/add-operation")}>
              Add Operations
            </button>
            <button className="btn-soft" onClick={() => nav("/admin/reports")}>
              View/Download Report
            </button>
          </div>
        </div>

        <div className="admin-card">
          <div className="reset-row">
            <div>
              <h3>Password</h3>
              <div className="card-subtitle">
                Update your admin password securely
              </div>
            </div>

            <button
              className="btn-soft"
              onClick={() => setShowReset((v) => !v)}
            >
              {showReset ? "Cancel" : "Reset Password"}
            </button>
          </div>

          {showReset ? (
            <form className="reset-form" onSubmit={changePassword}>
              <div className="field">
                <label>Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  placeholder="Enter current password"
                  required
                />
              </div>

              <div className="field">
                <label>New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  autoComplete="new-password"
                  placeholder="Enter new password"
                  required
                />
              </div>

              {msg ? (
                <div className={`message ${msg.includes("success") ? "ok" : "err"}`}>
                  {msg}
                </div>
              ) : null}

              <button className="btn-primary full" disabled={saving} type="submit">
                {saving ? "Updating..." : "Update Password"}
              </button>
            </form>
          ) : (
            <div className="hint">
              Tip: Use a strong password (12+ characters) and avoid reusing old passwords.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
