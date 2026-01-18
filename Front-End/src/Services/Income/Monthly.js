export async function Monthly(date) {
  const fetchUrl =
    process.env.REACT_APP_SERVER_URL + "/income/monthly?date=" + encodeURIComponent(date);

  const token = localStorage.getItem("token");

  const args = {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
    },
  };

  const response = await fetch(fetchUrl, args);
  const data = await response.json();
  return data;
}
