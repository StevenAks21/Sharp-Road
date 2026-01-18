export async function DeleteById(id) {
  const fetchUrl = process.env.REACT_APP_SERVER_URL + "/inventory/delete/" + encodeURIComponent(id);
  const token = localStorage.getItem("token");

  const args = {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const response = await fetch(fetchUrl, args);
  const data = await response.json();
  return data;
}