


export async function GetEmployeeById(id) {
    const fetchUrl = process.env.REACT_APP_SERVER_URL + `/employees/get/${id}`;
    const token = localStorage.getItem("token");

    const response = await fetch(fetchUrl,  {
        method : 'GET',
        headers : {
            'Authorization' : 'Bearer ' + token
        },
    })
    const data = await response.json();

    if (data.error) {
        throw new Error(data.message || "API returned error");
    }
    
    return data
}