import { Link } from "react-router-dom";
import Style from "../Style/Navbar.module.css";

function Navbar() {
    return (
        <div className={Style.navbar}>
            <Link to="/employees" className={Style.link}>
                Employees
            </Link>
            <Link to="/income" className={Style.link}>
                Income
            </Link>
            <Link to="/users" className={Style.link}>
                Users
            </Link>
            <Link to="/inventory" className={Style.link}>
                Inventory
            </Link>
        </div>
    );
}

export default Navbar;