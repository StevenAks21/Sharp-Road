export async function LogHours(id, hours) {
  const url = process.env.REACT_APP_SERVER_URL + "/employees/addhours";
  const token = localStorage.getItem("token");
  const parsedHours = parseInt(hours, 10)
  const arg = {
    method: `PUT`,
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id, hours: parsedHours }),
  };

  const response = await fetch(url, arg);
  const data = await response.json();
  return data;
}
