import Navbar from '../Components/Navbar'


async function logToken(){
    const token = localStorage.getItem('token');
    const url = `http://localhost:3001/employees/getall`
    const response = await fetch(url, {headers: {'Authorization': `Bearer ${token}`}});
    const data = await response.json();
    console.log("Response Data:", data);
    console.log("Token from localStorage:", token);
}
function Home() {
    return (
        <div>
            <Navbar></Navbar>
            <h1>Home Page</h1>
            <button onClick={logToken}>Log Token</button>
        </div>
    )
}

export default Home;