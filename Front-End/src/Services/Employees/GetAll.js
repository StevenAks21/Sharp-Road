
const fetchUrl = process.env.REACT_APP_SERVER_URL + '/employees/getall'
const token = localStorage.getItem(`token`)

export async function GetAll() {
    const response = await fetch(fetchUrl, {
        headers: {
            'Authorization': "Bearer " + token
        }
    })
    const data = await response.json()
    return data;
}