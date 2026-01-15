export async function RemoveEmployeeById(id) {
    const fetchUrl = process.env.REACT_APP_SERVER_URL + '/employees/delete';
    const token = localStorage.getItem("token");

    const args = {
        method: 'DELETE',
        headers: {
            'Authorization': "Bearer " + token,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: id }),
    };

    const response = await fetch(fetchUrl, args);
    const data = await response.json();

    if (data.error) {
        throw new Error(data.message || "API returned error");
    }

    return data;
}