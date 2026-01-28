// src/pages/AddExec.jsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./addExec.css";

export default function AddExecutive() {
  const nav = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  const [exeMobile, setExeMobile] = useState("");
  const [exeCompany, setExeCompany] = useState("");
  const [exeEmail, setExeEmail] = useState("");
  const [area, setArea] = useState("");
  const [designation, setDesignation] = useState("Executive");

  const [msg, setMsg] = useState("");
  const [saving, setSaving] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (
      !username ||
      !password ||
      !name ||
      !location ||
      !exeMobile ||
      !exeCompany ||
      !exeEmail ||
      !area ||
      !designation
    ) {
      setMsg("Please fill all fields.");
      return;
    }

    setSaving(true);
    try {
      await apiFetch("/api/admin/executives", {
        method: "POST",
        body: JSON.stringify({
          username,
          password,
          name,
          location,
          exe_mobile_number: exeMobile,
          exe_company_name: exeCompany,
          exe_email: exeEmail,
          area,
          designation,
        }),
      });

      setMsg("Executive added successfully.");
      setUsername("");
      setPassword("");
      setName("");
      setLocation("");
      setExeMobile("");
      setExeCompany("");
      setExeEmail("");
      setArea("");
      setDesignation("Executive");

      setTimeout(() => nav("/admin"), 700);
    } catch (err) {
      setMsg(err?.message || "Failed to add executive.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ae-page">
      <div className="ae-shell">
        <div className="ae-header">
          <div>
            <div className="ae-kicker">Admin</div>
            <h2 className="ae-title">Add Executive</h2>
          </div>

          <button className="ae-btn-ghost" onClick={() => nav("/admin")}>
            Back
          </button>
        </div>

        <div className="ae-card">
          <form onSubmit={submit}>
            <div className="ae-grid">
              <div className="ae-field">
                <label>Username</label>
                <input
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter username"
                  autoComplete="username"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  autoComplete="new-password"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Name</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Executive full name"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Location</label>
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="City / branch"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Executive Mobile Number</label>
                <input
                  value={exeMobile}
                  onChange={(e) => setExeMobile(e.target.value)}
                  placeholder="10-digit mobile"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Company Name</label>
                <input
                  value={exeCompany}
                  onChange={(e) => setExeCompany(e.target.value)}
                  placeholder="Company"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Email</label>
                <input
                  type="email"
                  value={exeEmail}
                  onChange={(e) => setExeEmail(e.target.value)}
                  placeholder="name@company.com"
                  required
                />
              </div>

              <div className="ae-field">
                <label>Area</label>
                <input
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  placeholder="Area / region"
                  required
                />
              </div>

              <div className="ae-field span-2">
                <label>Designation</label>
                <input value={designation} readOnly className="ae-readonly" />
              </div>
            </div>

            {msg ? (
              <div className={`ae-message ${msg.toLowerCase().includes("success") ? "ok" : "err"}`}>
                {msg}
              </div>
            ) : null}

            <button className="ae-btn-primary full" disabled={saving} type="submit">
              {saving ? "Saving..." : "Add Executive"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
