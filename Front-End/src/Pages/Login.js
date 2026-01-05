import { useState, useContext, useEffect } from "react";
import { languageContext, insideContext } from "../Contexts";
import { Link, useNavigate } from "react-router-dom";
import { handleLogin } from "../Services/Login/auth";
import Style from "../Style/Login.module.css";

const TEXT = {
    English: {
        title: "Login",
        subtitle: "Enter your username and password to continue.",
        username: "Username",
        password: "Password",
        switch: "Switch To Indonesian",
        button: "Login",
        missingLine1: "Please state your location and your language preference",
        missingLine2: "Tolong pilih lokasi anda dan preferensi bahasa anda",
        back: "Go Back To Welcome Page / Kembali Ke Halaman Awal"
    },
    Indonesian: {
        title: "Masuk",
        subtitle: "Masukkan nama pengguna dan kata sandi untuk lanjut.",
        username: "Nama Pengguna",
        password: "Kata Sandi",
        switch: "Ganti Ke Bahasa Inggris",
        button: "Masuk",
        missingLine1: "Tolong pilih lokasi anda dan preferensi bahasa anda",
        missingLine2: "Please state your location and your language preference",
        back: "Kembali Ke Halaman Awal / Go Back To Welcome Page"
    }
};

function Login() {
    const [userName, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const [language, setLanguage] = useContext(languageContext);
    const [insideBuilding] = useContext(insideContext);

    const navigate = useNavigate();
    const serverURL = process.env.REACT_APP_SERVER_URL;

    const text = language ? TEXT[language] : null;

    useEffect(() => {
        document.title = "Login Page";
    }, []);

    const onLoginClick = async () => {
        try {
            setErrorMessage("");

            await handleLogin({
                username: userName,
                password,
                serverURL
            });

            navigate("/home");
        } catch (err) {
            setErrorMessage(err.message);
        }
    };

    return (
        <div className={Style.container}>
            {/* -------- Guard -------- */}
            {(!language || insideBuilding === null) && (
                <>
                    <h2 className={Style.title}>
                        Location & Language Required
                    </h2>

                    <div className={Style.helperCard}>
                        <h2>{TEXT.English.missingLine1}</h2>
                        <h2>{TEXT.Indonesian.missingLine1}</h2>

                        <Link className={Style.link} to="/">
                            <button className={Style.helperButton}>
                                {TEXT.English.back}
                            </button>
                        </Link>
                    </div>
                </>
            )}

            {language && insideBuilding !== null && (
                <>
                    <h1 className={Style.title}>{text.title}</h1>

                    <div className={Style.card}>
                        <p className={Style.subtext}>{text.subtitle}</p>

                        <div className={Style.field}>
                            <label className={Style.label}>
                                {text.username}
                            </label>
                            <input
                                className={Style.input}
                                onChange={(e) =>
                                    setUserName(e.target.value)
                                }
                            />
                        </div>

                        <div className={Style.field}>
                            <label className={Style.label}>
                                {text.password}
                            </label>
                            <input
                                className={Style.input}
                                type="password"
                                onChange={(e) =>
                                    setPassword(e.target.value)
                                }
                            />
                        </div>

                        {errorMessage && (
                            <p className={Style.error}>
                                {errorMessage}
                            </p>
                        )}

                        <button
                            className={Style.primaryButton}
                            onClick={onLoginClick}
                        >
                            {text.button}
                        </button>

                        <div className={Style.buttonRow}>
                            <button
                                className={Style.button}
                                onClick={() =>
                                    setLanguage(
                                        language === "English"
                                            ? "Indonesian"
                                            : "English"
                                    )
                                }
                            >
                                {text.switch}
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Login;