//// src/lib/api.js
//const BASE = (process.env.REACT_APP_API_BASE_URL || "http://localhost:8080").replace(/\/$/, "");
//
//export async function api(path, { method = "GET", body, headers } = {}) {
//  const url = path.startsWith("http") ? path : `${BASE}${path}`;
//  const res = await fetch(url, {
//    method,
//    headers: { "Content-Type": "application/json", ...(headers || {}) },
//    body: body ? JSON.stringify(body) : undefined,
//    credentials: "include",
//  });
//
//  const text = await res.text();
//  let data = null;
//  const ct = res.headers.get("content-type") || "";
//  try {
//    if (ct.includes("application/json")) data = text ? JSON.parse(text) : null;
//    else data = text ? { message: text } : null;
//  } catch (_) {
//    data = text ? { message: text } : null;
//  }
//
//  if (!res.ok) {
//    const msg = (data && data.message) ? String(data.message).slice(0,500) : `HTTP ${res.status}`;
//    const err = new Error(msg);
//    err.status = res.status;
//    err.data = data;
//    throw err;
//  }
//  return data;
//}
