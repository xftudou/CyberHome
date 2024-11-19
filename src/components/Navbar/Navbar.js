import React from "react";
import { NavLink } from 'react-router-dom';
import "./Navbar.css";

function Navbar() {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    CyberHome
                </NavLink>

                <ul className="nav-menu">
                    <li className="nav-item">
                        <NavLink to="/login" className="nav-links">
                            LOGIN
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink to="/signup" className="nav-links">
                            SIGN UP
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;