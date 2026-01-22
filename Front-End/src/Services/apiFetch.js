export async function apiFetch(path, { method = "GET", body, headers } = {}) {
    const base = process.env.REACT_APP_SERVER_URL;
    const token = localStorage.getItem("token");

    const res = await fetch(base + path, {
    method,
    headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(headers || {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    });

    const raw = await res.text();
    let data;
    try { data = raw ? JSON.parse(raw) : null; } catch { data = raw; }

    if (!res.ok) {
    const msg = (data && data.message) ? data.message : `Request failed (${res.status})`;
    throw new Error(msg);
    }

    if (data && data.error) {
    throw new Error(data.message || "API returned error");
    }

    return data;
}