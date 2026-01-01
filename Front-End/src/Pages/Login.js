import { useState } from "react";


function Login(){
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");

    return(
        <div>
            <label>Username:</label>
            <input></input>
            <label>Password:</label>
            <input type="password"></input>
            <button>Login</button>
        </div>
    )
}

export default Login;