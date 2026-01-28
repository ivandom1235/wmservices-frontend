// src/components/AdminProtectedRoute.jsx

import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { apiFetch } from "../api";

export default function AdminProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        await apiFetch("/api/admin/me");
        if (alive) setOk(true);
      } catch {
        if (alive) setOk(false);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Loading...</div>;
  if (!ok) return <Navigate to="/admin/login" replace />;
  return children;
}
