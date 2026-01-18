
export async function GetInfo() {
  const token = localStorage.getItem("token");
  const url = process.env.REACT_APP_SERVER_URL + `/auth/whoami`;

  const response = await fetch(url, {
    headers: { Authorization: "Bearer " + token },
  });

  if (!response.ok) {
    throw new Error("Request failed with status " + response.status);
  }

  const data = await response.json();
  return data.user;
}