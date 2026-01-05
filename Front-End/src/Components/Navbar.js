import { Link } from "react-router-dom";
import Style from "../Style/Navbar.module.css";
import { languageContext } from "../Contexts";
import { useContext } from "react";

const TEXT = {
    English: {
        Employees: "Employees",
        Income: "Income",
        Users: "Users",
        Inventory: "Inventory",
        Switch: "ID",
    },
    Indonesian: {
        Employees: "Karyawan",
        Income: "Pendapatan",
        Users: "Pengguna",
        Inventory: "Inventaris",
        Switch: "EN",
    }
};

function Navbar() {
    const [language, setLanguage] = useContext(languageContext);
    const text = language ? TEXT[language] : TEXT.English;
    const switchLanguage = language === "English" ? "Indonesian" : "English";

    return (
        <nav className={Style.navbar}>
            <div className={Style.links}>
                <Link to="/employees" className={Style.link}>{text.Employees}</Link>
                <Link to="/income" className={Style.link}>{text.Income}</Link>
                <Link to="/users" className={Style.link}>{text.Users}</Link>
                <Link to="/inventory" className={Style.link}>{text.Inventory}</Link>
            </div>

            <button
                className={Style.languageBtn}
                onClick={() => setLanguage(switchLanguage)}
                aria-label="Switch language"
            >
                🌐 {text.Switch}
            </button>
        </nav>
    );
}

export default Navbar;