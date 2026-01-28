// src/pages/AddOperation.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./addOperation.css";

export default function AddOperation() {
  const nav = useNavigate();

  const [form, setForm] = useState({
    name: "",
    username: "",
    mobile_number: "",
    email: "",
    password: "",
    remark: "",
  });

  const [msg, setMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });
    setSaving(true);

    try {
      await apiFetch("/api/admin/operations", {
        method: "POST",
        body: JSON.stringify(form),
      });

      nav("/admin", { state: { flash: "Operations user created successfully." } });
    } catch (err) {
      setMsg({ type: "err", text: err.message || "Failed to add operations user" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="addop-page">
      <div className="addop-shell">
        <div className="addop-header">
          <div>
            <div className="addop-kicker">Admin</div>
            <h1 className="addop-title">Add Operations User</h1>
            
          </div>
          <button className="et-btn-ghost" onClick={() => nav("/admin")}>
            Back
          </button>
        </div>

        <div className="addop-card">
          <form onSubmit={submit}>
            <div className="addop-grid">
              <div className="addop-field">
                <label>Name</label>
                <input
                  name="name"
                  placeholder="Name"
                  value={form.name}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="addop-field">
                <label>Username</label>
                <input
                  name="username"
                  placeholder="Username"
                  value={form.username}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="addop-field">
                <label>Mobile Number</label>
                <input
                  name="mobile_number"
                  placeholder="Mobile Number"
                  value={form.mobile_number}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="addop-field">
                <label>Email</label>
                <input
                  name="email"
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="addop-field">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  placeholder="Password (min 8 characters)"
                  value={form.password}
                  onChange={onChange}
                  required
                />
              </div>

              <div className="addop-field">
                <label>Role</label>
                <input value="Operations" className="addop-readonly" disabled />
              </div>

              <div className="addop-field span-2">
                <label>Remark (optional)</label>
                <textarea
                  name="remark"
                  placeholder="Remark (optional)"
                  value={form.remark}
                  onChange={onChange}
                />
              </div>
            </div>

            {msg.text && <div className={`addop-message ${msg.type}`}>{msg.text}</div>}

            <button className="addop-btn-primary full" disabled={saving}>
              {saving ? "Saving..." : "Create"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
