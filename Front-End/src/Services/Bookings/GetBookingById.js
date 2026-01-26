export async function GetBookingById(id) {
  const fetchUrl = process.env.REACT_APP_SERVER_URL + "/bookings/get/" + encodeURIComponent(id);
  const token = localStorage.getItem("token");

  const response = await fetch(fetchUrl, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: "Bearer " + token } : {}),
    },
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