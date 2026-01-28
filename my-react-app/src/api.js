// src/api.js
const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL?.replace(/\/$/, "") ||
  "http://localhost:5000";

async function safeParse(res) {
  const text = await res.text();
  if (!text) return null;

  const ct = res.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    try {
      return JSON.parse(text);
    } catch {
      // fallthrough
    }
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export async function apiFetch(path, opts = {}) {
  const url = `${API_BASE}${path}`;
  const method = String(opts.method || "GET").toUpperCase();

  const headers = { ...(opts.headers || {}) };

  // ✅ Only set JSON header when body is not FormData
  const isFormData =
    typeof FormData !== "undefined" && opts.body instanceof FormData;

  if (!isFormData && !headers["Content-Type"] && !headers["content-type"]) {
    headers["Content-Type"] = "application/json";
  }

  const res = await fetch(url, {
    ...opts,
    method,
    credentials: "include", // ✅ must be here
    headers,
  });

  const data = await safeParse(res);

  if (!res.ok) {
    const msg =
      data?.message ||
      data?.error ||
      (typeof data === "string" ? data : null) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return data;
}
