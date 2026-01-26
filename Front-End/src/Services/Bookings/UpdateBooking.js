export async function UpdateBooking({ id, name, startTime, endTime, services }) {
  const fetchUrl = process.env.REACT_APP_SERVER_URL + "/bookings/update";
  const token = localStorage.getItem("token");

  const response = await fetch(fetchUrl, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
    body: JSON.stringify({ id, name, startTime, endTime, services }),
  });

  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {}

  if (!response.ok) {
    throw new Error(data?.message || raw || `Request failed (${response.status})`);
  }

  if (data?.error) {
    throw new Error(data?.message || "API returned error");
  }

  return data;
}