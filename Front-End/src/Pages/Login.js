import { useState, useContext } from "react";
import { languageContext, insideContext } from "../Contexts";
import { Link } from "react-router-dom";


function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [language] = useContext(languageContext);
    const [insideBuilding] = useContext(insideContext);


    const handleLogin = () => {
        console.log(`Username: ${userName}, Password: ${password}`);
        console.log(`Language: ${language}`);
        console.log(`Server URL: ${process.env.REACT_APP_SERVER_URL}`);
    }


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