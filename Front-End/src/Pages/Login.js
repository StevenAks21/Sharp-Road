import { useState, useContext, useEffect } from "react";
import { languageContext, insideContext } from "../Contexts";
import { Link } from "react-router-dom";
import Style from "../Style/Login.module.css";


function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [language, setLanguage] = useContext(languageContext);
    const [insideBuilding] = useContext(insideContext);
    const [error, setError] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    const serverURL = process.env.REACT_APP_SERVER_URL;


    const handleLogin = async () => {
        try {
            const response = await fetch(`${serverURL}/auth`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: userName,
                    password
                })
            });

            const json = await response.json();

            if (!response.ok) {
                setError(true);
                setErrorMessage(json.message);
                return;
            }

            localStorage.setItem("token", json.token);
            setError(false);
            setErrorMessage("");

            console.log("Login successful");

        } catch (err) {
            setError(true);
            setErrorMessage("Server error. Please try again later.");
        }
    };

    useEffect(() => {
        document.title = "Login Page";
    }, [])


    if (insideBuilding === null || language === null) {
        return (
            <div className={Style.container}>
                <h2 className={Style.title}>Location & Language Required</h2>
                <div className={Style.helperCard}>
                    <h2>Please state your location and your language preference</h2>
                    <h2>Tolong pilih lokasi anda dan preferensi bahasa anda</h2>
                    <Link className={Style.link} to="/"><button className={Style.helperButton}>Go Back To Welcome Page / Kembali Ke Halaman Awal</button></Link>
                </div>
            </div>
        )
    }

    if (language === "English") {
        return (
            <div className={Style.container}>
                <h1 className={Style.title}>Login</h1>
                <div className={Style.card}>
                    <p className={Style.subtext}>Enter your username and password to continue.</p>

                    <div className={Style.field}>
                        <label className={Style.label}>Username:</label>
                        <input
                            className={Style.input}
                            onChange={(e) => { setUserName(e.target.value) }}
                        />
                    </div>

                    <div className={Style.field}>
                        <label className={Style.label}>Password:</label>
                        <input
                            className={Style.input}
                            type="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </div>

                    {error && <p className={Style.error}>{errorMessage}</p>}

                    <button
                        className={Style.primaryButton}
                        onClick={() => { handleLogin() }}
                    >
                        Login
                    </button>

                    <div className={Style.buttonRow}>
                        <button
                            className={Style.button}
                            onClick={() => { setLanguage("Indonesian") }}
                        >
                            Switch To Indonesian
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    else {
        return (
            <div className={Style.container}>
                <h1 className={Style.title}>Masuk</h1>
                <div className={Style.card}>
                    <p className={Style.subtext}>Masukkan nama pengguna dan kata sandi untuk lanjut.</p>

                    <div className={Style.field}>
                        <label className={Style.label}>Nama Pengguna</label>
                        <input
                            className={Style.input}
                            onChange={(e) => { setUserName(e.target.value) }}
                        />
                    </div>

                    <div className={Style.field}>
                        <label className={Style.label}>Kata Sandi</label>
                        <input
                            className={Style.input}
                            type="password"
                            onChange={(e) => { setPassword(e.target.value) }}
                        />
                    </div>

                    {error && <p className={Style.error}>{errorMessage}</p>}

                    <button
                        className={Style.primaryButton}
                        onClick={() => { handleLogin() }}
                    >
                        Login
                    </button>

                    <div className={Style.buttonRow}>
                        <button
                            className={Style.button}
                            onClick={() => { setLanguage("English") }}
                        >
                            Ganti Ke Bahasa Inggris
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}

export default Login;