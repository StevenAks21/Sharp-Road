import { NavLink } from "react-router-dom";
import Style from "../Style/Navbar.module.css"

function Navbar() {
    return (
        <nav className={Style.navbar}>
            <h1 className={Style.logo}>SharpRoad</h1>

            <div className={Style.links}>
                <NavLink
                    to="/employees"
                    className={({ isActive }) =>
                        isActive ? Style.activeLink : Style.link
                    }
                >
                    Employees
                </NavLink>

                <NavLink
                    to="/income"
                    className={({ isActive }) =>
                        isActive ? Style.activeLink : Style.link
                    }
                >
                    Income
                </NavLink>

                <NavLink
                    to="/users"
                    className={({ isActive }) =>
                        isActive ? Style.activeLink : Style.link
                    }
                >
                    Users
                </NavLink>

                <NavLink
                    to="/inventory"
                    className={({ isActive }) =>
                        isActive ? Style.activeLink : Style.link
                    }
                >
                    Inventory
                </NavLink>
            </div>
        </nav>
    );
}

export default Navbar;