

export async function Daily(date) {
    const fetchUrl = process.env.REACT_APP_SERVER_URL + '/income/daily/' + date;

    const token = localStorage.getItem(`token`)

    const args = {
        method: 'GET',
        headers: {'Authorization' : 'Bearer ' + token}
    }

    const response = await fetch(fetchUrl, args)
    
    const data = await response.json()
    console.log(data)

    return data;
}