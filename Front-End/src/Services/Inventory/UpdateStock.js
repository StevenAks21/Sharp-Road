export async function UpdateStock(id, stock) {
  const fetchUrl = process.env.REACT_APP_SERVER_URL + "/inventory/update/" + encodeURIComponent(id);
  const token = localStorage.getItem("token");

  const args = {
    method: "PUT",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ stock }),
  };

  const response = await fetch(fetchUrl, args);
  const data = await response.json();
  return data;
}