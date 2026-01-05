

export async function FetchName() {
    const token = localStorage.getItem('token');
    const url = process.env.REACT_APP_SERVER_URL + `/auth/whoami`

    const response = await fetch(url, { headers: { 'Authorization': "Bearer " + token } })
    const data = await response.json()
    const user = data.user
    return user
}