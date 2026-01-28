// src/pages/EditExecutive.jsx

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";
import "./editExecutive.css";

export default function EditExecutive() {
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const [execs, setExecs] = useState([]);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("");

  const selected = useMemo(() => {
    return execs.find((e) => String(e.id) === String(selectedId)) || null;
  }, [execs, selectedId]);

  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [exeMobile, setExeMobile] = useState("");
  const [exeCompany, setExeCompany] = useState("");
  const [exeEmail, setExeEmail] = useState("");
  const [area, setArea] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await apiFetch("/api/admin/executives");
        setExecs(data.executives || []);
      } catch (err) {
        setMsg(err?.message || "Failed to load executives.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selected) return;
    setUsername(selected.username || "");
    setName(selected.name || "");
    setLocation(selected.location || "");
    setExeMobile(selected.exe_mobile_number || "");
    setExeCompany(selected.exe_company_name || "");
    setExeEmail(selected.exe_email || "");
    setArea(selected.area || "");
    setPassword("");
    setMsg("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  const filteredExecs = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return execs;
    return execs.filter((e) => {
      const hay = [
        e.username,
        e.name,
        e.exe_email,
        e.exe_mobile_number,
        e.exe_company_name,
        e.area,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [execs, query]);

  const save = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!selectedId) return setMsg("Please select an executive.");

    if (!username || !name || !location || !exeMobile || !exeCompany || !exeEmail || !area) {
      return setMsg("Please fill all fields (password is optional).");
    }

    setSaving(true);
    try {
      await apiFetch(`/api/admin/executives/${selectedId}`, {
        method: "PUT",
        body: JSON.stringify({
          username,
          name,
          location,
          exe_mobile_number: exeMobile,
          exe_company_name: exeCompany,
          exe_email: exeEmail,
          area,
          password: password || undefined,
        }),
      });

      setMsg("Executive updated successfully.");

      const data = await apiFetch("/api/admin/executives");
      setExecs(data.executives || []);
      setPassword("");
    } catch (err) {
      setMsg(err?.message || "Failed to update executive.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="ee-page">
      <div className="ee-shell">
        <div className="ee-header">
          <div>
            <div className="ee-kicker">Admin</div>
            <h2 className="ee-title">Edit Executive</h2>
          </div>

          <button className="ee-btn-ghost" onClick={() => nav("/admin")}>
            Back
          </button>
        </div>

        {loading ? (
          <div className="ee-card">
            <div className="ee-loading">Loading...</div>
          </div>
        ) : (
          <>
            <div className="ee-card">
              <div className="ee-controls">
                <div className="ee-field">
                  <label>Search</label>
                  <input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by username, name, email, mobile, company, area..."
                  />
                </div>

                <div className="ee-field">
                  <label>Select Executive</label>
                  <select value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
                    <option value="">-- Select --</option>
                    {filteredExecs.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.name || e.username} ({e.exe_email || "no-email"}) — {e.area || "no-area"}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {msg ? (
                <div className={`ee-message ${msg.toLowerCase().includes("success") ? "ok" : "err"}`}>
                  {msg}
                </div>
              ) : null}
            </div>

            {selected ? (
              <div className="ee-card">
                <form onSubmit={save}>
                  <div className="ee-grid">
                    <div className="ee-field">
                      <label>Username</label>
                      <input value={username} onChange={(e) => setUsername(e.target.value)} />
                    </div>

                    <div className="ee-field">
                      <label>Name</label>
                      <input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>

                    <div className="ee-field">
                      <label>Location</label>
                      <input value={location} onChange={(e) => setLocation(e.target.value)} />
                    </div>

                    <div className="ee-field">
                      <label>Executive Mobile Number</label>
                      <input value={exeMobile} onChange={(e) => setExeMobile(e.target.value)} />
                    </div>

                    <div className="ee-field">
                      <label>Company Name</label>
                      <input value={exeCompany} onChange={(e) => setExeCompany(e.target.value)} />
                    </div>

                    <div className="ee-field">
                      <label>Email</label>
                      <input
                        type="email"
                        value={exeEmail}
                        onChange={(e) => setExeEmail(e.target.value)}
                      />
                    </div>

                    <div className="ee-field span-2">
                      <label>Area</label>
                      <input value={area} onChange={(e) => setArea(e.target.value)} />
                    </div>

                    <div className="ee-field span-2">
                      <label>Reset Password (optional)</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Leave empty to keep current password"
                        autoComplete="new-password"
                      />
                    </div>

                    <div className="ee-field span-2">
                      <label>Designation</label>
                      <input
                        value={selected.designation || "Executive"}
                        readOnly
                        className="ee-readonly"
                      />
                    </div>
                  </div>

                  <button className="ee-btn-primary full" disabled={saving} type="submit">
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                </form>
              </div>
            ) : (
              <div className="ee-card">
                <div className="ee-hint">Select an executive to edit.</div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
