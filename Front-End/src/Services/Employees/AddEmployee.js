export async function AddEmployee(name) {
  const fetchUrl = process.env.REACT_APP_SERVER_URL + "/employees/add";
  const token = localStorage.getItem("token");

  const response = await fetch(fetchUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
    body: JSON.stringify({ name }),
  });

  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {

  }

  if (!response.ok) {
    throw new Error(data?.message || raw || `Request failed (${response.status})`);
  }

  if (data?.error) {
    throw new Error(data?.message || "API returned error");
  }

  return data;
}