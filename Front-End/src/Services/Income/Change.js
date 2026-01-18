export async function Change(date, cash, fnb, qris, note) {
    const fetchUrl = process.env.REACT_APP_SERVER_URL + '/income/daily'
    const token = localStorage.getItem(`token`)

    const args = {
        method : 'PUT',
        headers: {
            'Authorization' : 'Bearer ' + token,
            'Content-Type' : 'application/json'
        },
        body : JSON.stringify({date, cash, fnb, qris})
    }

    const response = await fetch(fetchUrl, args)
    const data = await response.json()

    return data;

}