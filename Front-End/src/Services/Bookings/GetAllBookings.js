export async function GetAllBookings(startTime, endTime) {
  const baseUrl = process.env.REACT_APP_SERVER_URL + "/bookings/getall";

  const params = new URLSearchParams();
  if (startTime) params.set("start_time", startTime);
  if (endTime) params.set("end_time", endTime);

  const fetchUrl = params.toString() ? `${baseUrl}?${params.toString()}` : baseUrl;

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

  return data?.result ?? [];
}