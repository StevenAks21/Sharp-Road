import { useContext, useEffect } from "react";
import { insideContext, languageContext } from "../Contexts";
import { Link } from "react-router-dom";
import styles from "../Style/Welcome.module.css";

const TEXT = {
    English: {
        chooseLanguageTitle: "Please Choose Your Language",
        chooseLanguageSub: "Silakan Pilih Bahasa Anda",
        insideQuestion: "Are you inside the building?",
        yes: "Yes",
        no: "No",
        summary: "Your Selections",
        language: "Language",
        inside: "Inside Building",
        login: "Login"
    },
    Indonesian: {
        chooseLanguageTitle: "Silakan Pilih Bahasa Anda",
        chooseLanguageSub: "Please Choose Your Language",
        insideQuestion: "Apakah Anda berada di dalam gedung?",
        yes: "Ya",
        no: "Tidak",
        summary: "Pilihan Anda",
        language: "Bahasa",
        inside: "Dalam Gedung",
        login: "Login"
    }
};

function LanguageSelector({ onSelect }) {
    return (
        <div className={styles.card}>
            <h2>{TEXT.English.chooseLanguageTitle}</h2>
            <p className={styles.subtext}>{TEXT.English.chooseLanguageSub}</p>

            <div className={styles.buttonGroup}>
                <button
                    className={styles.button}
                    onClick={() => onSelect("English")}
                >
                    English
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelect("Indonesian")}
                >
                    Bahasa Indonesia
                </button>
            </div>
        </div>
    );
}

function LocationSelector({ text, onSelect }) {
    return (
        <div className={styles.card}>
            <h2>{text.insideQuestion}</h2>

            <div className={styles.buttonGroup}>
                <button
                    className={styles.button}
                    onClick={() => onSelect(true)}
                >
                    {text.yes}
                </button>
                <button
                    className={styles.button}
                    onClick={() => onSelect(false)}
                >
                    {text.no}
                </button>
            </div>
        </div>
    );
}

function Summary({ text, language, insideBuilding }) {
    return (
        <div className={styles.card}>
            <h2>{text.summary}</h2>

            <div className={styles.summary}>
                <p>
                    <span>{text.language}:</span> {language}
                </p>
                <p>
                    <span>{text.inside}:</span>{" "}
                    {insideBuilding ? text.yes : text.no}
                </p>
            </div>

            <Link to="/login" className={styles.link}>
                <button className={styles.primaryButton}>
                    {text.login}
                </button>
            </Link>
        </div>
    );
}

function Welcome() {
    const [insideBuilding, setInsideBuilding] = useContext(insideContext);
    const [language, setLanguage] = useContext(languageContext);

    const text = language ? TEXT[language] : null;
    useEffect(() => {
        document.title = "SharpRoad - Welcome";
    })

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>SharpRoad</h1>

            {!language && (
                <LanguageSelector onSelect={setLanguage} />
            )}

            {language && insideBuilding === null && (
                <LocationSelector
                    text={text}
                    onSelect={setInsideBuilding}
                />
            )}

            {language && insideBuilding !== null && (
                <Summary
                    text={text}
                    language={language}
                    insideBuilding={insideBuilding}
                />
            )}
        </div>
    );
}

export default Welcome;