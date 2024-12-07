import React from "react";
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import "./Navbar.css";

function Navbar() {
    const auth = useAuth();
    console.log(auth);

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/" className="navbar-logo">
                    CyberHome
                </NavLink>

                <ul className="nav-menu">
                    {user ? (
                        <>
                            <li className="nav-item">
                                <NavLink to={`/user/${user.username}`} className="nav-links">
                                    {user.name}
                                </NavLink>
                            </li>
                            <li className="nav-item">
                                <button onClick={handleLogout} className="logout-button">
                                    LOGOUT
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
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
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;