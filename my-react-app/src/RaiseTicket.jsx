// src/pages/RaiseTicket.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./raiseticket.css";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

export default function RaiseTicket() {
  const nav = useNavigate();

  const services = useMemo(
    () => [
      { title: "Utility Bill Payment", path: "/tickets/utility-bill-payment" },
      { title: "Bank Related Services", path: "/tickets/bank-related-services" },
      { title: "Postal Services", path: "/tickets/postal-services" },
      { title: "Courier Services", path: "/tickets/courier-services" },
      {
        title: "Notary/Stamp paper & Affidavite Services",
        path: "/tickets/notary-stamp-affidavite-services",
      },
      { title: "Education solutions", path: "/tickets/education-solutions" },
      { title: "Ticket Booking Services", path: "/tickets/ticket-booking-services" },
      { title: "Entertainment Services", path: "/tickets/entertainment-services" },
      { title: "Delivery Services", path: "/tickets/delivery-services" },
      { title: "Event planning Services", path: "/tickets/event-planning-services" },
      { title: "Passport Related Services", path: "/tickets/passport-related-services" },
      { title: "Holiday planning", path: "/tickets/holiday-planning" },
      { title: "Pan & ITR Services", path: "/tickets/pan-itr-services" },
      { title: "RTO Services", path: "/tickets/rto-services" },
      { title: "Party & Events Services", path: "/tickets/party-events-services" },
      { title: "Municipality Services", path: "/tickets/municipality-services" },
      { title: "Repair and Maintainence Services", path: "/tickets/repair-maintainence-services" },
      { title: "Real Estate Services", path: "/tickets/real-estate-services" },
      { title: "Travel Management", path: "/tickets/travel-management" },
      { title: "Health Management", path: "/tickets/health-management" },
      { title: "Relocation Packers & Movers", path: "/tickets/relocation-packers-movers" },
      { title: "Other Services", path: "/tickets/other-services" },
    ],
    []
  );

  const [query, setQuery] = useState("");
  const [authLoading, setAuthLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [err, setErr] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return services;
    return services.filter((s) => s.title.toLowerCase().includes(q));
  }, [query, services]);

  useEffect(() => {
    (async () => {
      try {
        setErr("");
        const res = await fetch(`${API_BASE}/api/me`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          nav("/");
          return;
        }

        const data = await res.json();
        setUser(data?.user || null);
      } catch (e) {
        setErr(e?.message || "Failed to load user");
      } finally {
        setAuthLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (authLoading) {
    return (
      <div className="rt-page">
        <div className="rt-container">
          <div className="rt-header">
            <h2 className="rt-title">Raise Ticket</h2>
          </div>
          <p className="rt-subtitle">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="rt-page">
        <div className="rt-container">
          <h2 className="rt-title">Unauthorized</h2>
          {err && (
            <div className="rt-error">
              <strong>Error:</strong> {err}
            </div>
          )}
          <button className="rt-btn" style={{ marginTop: 12 }} onClick={() => nav("/")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rt-page">
      <div className="rt-container">
        <div className="rt-header">
          <div className="rt-header-left">
            <h2 className="rt-title">Raise Ticket</h2>
            <p className="rt-subtitle">
              Choose a service category to create your request
            </p>
          </div>

          <div className="rt-header-actions">
            <button className="rt-btn rt-btn-secondary" onClick={() => nav("/welcome")}>
              Back
            </button>

            <button
              className="rt-btn rt-btn-ghost"
              onClick={async () => {
                try {
                  await fetch(`${API_BASE}/api/logout`, {
                    method: "POST",
                    credentials: "include",
                  });
                } finally {
                  nav("/");
                }
              }}
            >
              Logout
            </button>
          </div>
        </div>

        <div className="rt-userline">
          <span className="rt-pill">
            <span className="rt-dot" />
            User: <b>{user.username}</b>
          </span>
        </div>

        <div className="rt-search">
          <label className="rt-label" htmlFor="serviceQuery">
            Search services
          </label>
          <input
            id="serviceQuery"
            className="rt-input"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to filter service categories..."
          />
        </div>

        {filtered.length === 0 ? (
          <div className="rt-empty">
            No services found for <b>“{query}”</b>.
          </div>
        ) : (
          <div className="rt-grid">
            {filtered.map((s) => (
              <button
                key={s.path}
                className="rt-card"
                onClick={() => nav(s.path, { state: { service: s.title } })}
                title={s.title}
              >
                <div className="rt-card-title">{s.title}</div>
                <div className="rt-card-sub">Click to continue</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
