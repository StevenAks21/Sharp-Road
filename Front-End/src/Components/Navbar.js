import { NavLink } from "react-router-dom";
import Style from "../Style/Navbar.module.css";
import { languageContext } from "../Contexts";
import { useContext } from "react";

const TEXT = {
    English: {
        Home: "Home",
        Employees: "Employees",
        Income: "Income",
        Users: "User Info",
        Inventory: "Inventory",
        Switch: "ID",
        Booking: 'Booking'
    },
    Indonesian: {
        Home: "Beranda",
        Employees: "Karyawan",
        Income: "Pendapatan",
        Users: "Informasi Pengguna",
        Inventory: "Inventaris",
        Switch: "EN",
        Booking: 'pemesanan'
    }
};

function Navbar() {
    const [language, setLanguage] = useContext(languageContext);
    const text = language ? TEXT[language] : TEXT.English;
    const switchLanguage = language === "English" ? "Indonesian" : "English";

    const navClass = ({ isActive }) =>
        isActive ? `${Style.link} ${Style.active}` : Style.link;

    return (
        <nav className={Style.navbar}>
            <div className={Style.links}>
                <NavLink to="/home" className={navClass}>{text.Home}</NavLink>
                <NavLink to="/employees" className={navClass}>{text.Employees}</NavLink>
                <NavLink to="/income" className={navClass}>{text.Income}</NavLink>
                <NavLink to="/userinfo" className={navClass}>{text.Users}</NavLink>
                <NavLink to="/inventory" className={navClass}>{text.Inventory}</NavLink>
                <NavLink to="/booking" className={navClass}>{text.Booking}</NavLink>
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