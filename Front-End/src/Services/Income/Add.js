

export async function Add(date, cash, fnb, qris) {

    const fetchUrl = process.env.REACT_APP_SERVER_URL + '/income/add'
    const token = localStorage.getItem('token')
    const args = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ date: date, cash: cash, fnb: fnb, qris: qris })
    }

    const response = await fetch(fetchUrl, args)
    const data = await response.json()

    return data;



}