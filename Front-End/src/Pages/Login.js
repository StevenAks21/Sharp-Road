import { useState, useContext, useEffect } from "react";
import { languageContext, insideContext } from "../Contexts";
import { Link } from "react-router-dom";


function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [language] = useContext(languageContext);
    const [insideBuilding] = useContext(insideContext);

    const serverURL = process.env.REACT_APP_SERVER_URL;


    const handleLogin = async () => {
        console.log(`Username: ${userName}, Password: ${password}`);
        console.log(`Language: ${language}`);

        const response = await fetch(`${serverURL}/auth`, {
            method: `POST`,
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username: userName,
                password: password
            })
        })
        const json = await response.json();
        console.log(json);

        console.log(`Response status: ${response.status}`);
    }

    useEffect(() => {
        document.title = "Login Page";
    }, [])


    if (insideBuilding === null || language === null) {
        return (
            <div>
                <h2>Please state your location and your language preference</h2>
                <h2>Tolong pilih lokasi anda dan preferensi bahasa anda</h2>
                <Link to="/"><button>Go back to home page / Kembali ke beranda</button></Link>
            </div>
        )
    }

    return (
        <div>
            <label>Username:</label>
            <input onChange={(e) => { setUserName(e.target.value) }}></input>
            <label>Password:</label>
            <input type="password" onChange={(e) => { setPassword(e.target.value) }}></input>
            <button onClick={() => { handleLogin() }}>Login</button>
        </div>
    )
}

export default Login;