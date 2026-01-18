export async function NewItem(name, stock = 0) {
  const fetchUrl = process.env.REACT_APP_SERVER_URL + "/inventory/newitem";
  const token = localStorage.getItem("token");

  const args = {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name, stock }),
  };

  const response = await fetch(fetchUrl, args);
  const data = await response.json();
  return data;
}