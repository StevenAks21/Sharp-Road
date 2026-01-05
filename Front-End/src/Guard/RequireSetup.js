import { useContext, useEffect } from "react";
import { languageContext, insideContext } from "../Contexts";
import { useNavigate } from "react-router-dom";
import Style from "../Style/RequireSetup.module.css";

const TEXT = {
    English: {
        warning: "Setup Required",
        message: "Language and location is not yet defined, please go back to the welcome page.",
        button: "Go Back To Welcome Page"
    },
    Indonesian: {
        warning: "Pengaturan Diperlukan",
        message: "Bahasa dan lokasi belum ditentukan, silakan kembali ke halaman awal.",
        button: "Kembali Ke Halaman Awal"
    }
};

function RequireSetup({ children }) {
    const [language] = useContext(languageContext);
    const [insideBuilding] = useContext(insideContext);
    const navigate = useNavigate();

    const isBlocked = !language || insideBuilding === null;

    useEffect(() => {
        if (isBlocked) {
            document.title =
                "SharpRoad - Setup Required / Pengaturan Diperlukan";
        }
    }, [isBlocked]);

    if (isBlocked) {
        return (
            <div className={Style.container}>
                <h1 className={Style.title}>
                    {TEXT.English.warning} / {TEXT.Indonesian.warning}
                </h1>

                <div className={Style.card}>
                    <p className={Style.subtext}>
                        {TEXT.English.message}
                    </p>
                    <p className={Style.subtext}>
                        {TEXT.Indonesian.message}
                    </p>

                    <button
                        className={Style.primaryButton}
                        onClick={() => navigate("/")}
                    >
                        {TEXT.English.button} / {TEXT.Indonesian.button}
                    </button>
                </div>
            </div>
        );
    }

    return children;
}

export default RequireSetup;