import { useContext, useState } from "react";
import { insideContext, languageContext } from "../App";
import { Link } from "react-router-dom";



function Welcome() {
    const [insideBuilding, setInsideBuilding] = useContext(insideContext)
    const [language, setLanguage] = useContext(languageContext)
    const [status, setStatus] = useState(null);

    function chooseLanguage() {
        return (
            <div>
                <h2>Please Choose Your Language / Silakan Pilih Bahasa Anda</h2>
                <button onClick={() => setLanguage('English')}>English</button>
                <button onClick={() => setLanguage('Indonesian')}>Bahasa Indonesia</button>
            </div>
        )
    }

    function chooseLocation() {

        if (language === 'English') {
            return (
                <div>
                    <h2>Are you inside the building?</h2>
                    <button onClick={() => {
                        setInsideBuilding(true)
                        setStatus('Yes')
                    }}>Yes</button>
                    <button onClick={() => {
                        setInsideBuilding(false)
                        setStatus('No')
                    }
                    }>No</button>
                </div>
            )
        }

        else {
            return (
                <div>
                    <h2>Apakah Anda berada di dalam gedung?</h2>
                    <button onClick={() => {
                        setInsideBuilding(true)
                        setStatus('Ya')
                    }}>Ya</button>
                    <button onClick={() => {
                        setInsideBuilding(false)
                        setStatus('Tidak')
                    }}>Tidak</button>
                </div>
            )
        }
    }
    return (
        <div>
            <h1>Welcome to SharpRoad</h1>
            {language === null ? chooseLanguage() : <></>}
            {language !== null && insideBuilding === null ? chooseLocation() : <></>}
            {language !== null && insideBuilding !== null ?
                <div>
                    {language === 'English' ? <p>Your Selections</p> : <p>Pilihan anda</p>}
                    <p>{language === "English" ? 'Language' : 'Bahasa'}: {language}</p>
                    <p>{language === 'English' ? 'Inside Building: ' : 'Dalam Gedung'} {status}</p>

                    <Link to="/login"><button>Proceed to Login</button></Link>
                </div>
                : <></>}
        </div>
    )
}

export default Welcome;