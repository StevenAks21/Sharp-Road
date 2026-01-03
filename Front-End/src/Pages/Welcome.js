import { useContext, useState } from "react";
import { insideContext, languageContext } from "../App";
import { Link } from "react-router-dom";
import Style from "../Style/Welcome.module.css";

function Welcome() {
    const [insideBuilding, setInsideBuilding] = useContext(insideContext);
    const [language, setLanguage] = useContext(languageContext);
    const [status, setStatus] = useState(null);

    function chooseLanguage() {
        return (
            <div className={Style.card}>
                <h2>Please Choose Your Language</h2>
                <p className={Style.subtext}>Silakan Pilih Bahasa Anda</p>

                <div className={Style.buttonGroup}>
                    <button
                        onClick={() => setLanguage("English")}
                        className={Style.button}
                    >
                        English
                    </button>
                    <button
                        onClick={() => setLanguage("Indonesian")}
                        className={Style.button}
                    >
                        Bahasa Indonesia
                    </button>
                </div>
            </div>
        );
    }

    function chooseLocation() {
        return (
            <div className={Style.card}>
                <h2>
                    {language === "English"
                        ? "Are you inside the building?"
                        : "Apakah Anda berada di dalam gedung?"}
                </h2>

                <div className={Style.buttonGroup}>
                    <button
                        className={Style.button}
                        onClick={() => {
                            setInsideBuilding(true);
                            setStatus(language === "English" ? "Yes" : "Ya");
                        }}
                    >
                        {language === "English" ? "Yes" : "Ya"}
                    </button>

                    <button
                        className={Style.button}
                        onClick={() => {
                            setInsideBuilding(false);
                            setStatus(language === "English" ? "No" : "Tidak");
                        }}
                    >
                        {language === "English" ? "No" : "Tidak"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={Style.container}>
            <h1 className={Style.title}>SharpRoad</h1>

            {language === null && chooseLanguage()}

            {language !== null && insideBuilding === null && chooseLocation()}

            {language !== null && insideBuilding !== null && (
                <div className={Style.card}>
                    <h2>
                        {language === "English" ? "Your Selections" : "Pilihan Anda"}
                    </h2>

                    <div className={Style.summary}>
                        <p>
                            <span>{language === "English" ? "Language" : "Bahasa"}:</span>{" "}
                            {language}
                        </p>
                        <p>
                            <span>
                                {language === "English"
                                    ? "Inside Building"
                                    : "Dalam Gedung"}
                                :
                            </span>{" "}
                            {status}
                        </p>
                    </div>

                    <Link to="/login" className={Style.link}>
                        <button className={Style.primaryButton}>Login</button>
                    </Link>
                </div>
            )}
        </div>
    );
}

export default Welcome;