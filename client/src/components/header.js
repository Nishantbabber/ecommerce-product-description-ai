import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">AIProductWriter</Link>
            </div>
            <nav>
                <ul className="nav-links">
                    {/* Show "Home" link only if not on the homepage */}
                    {location.pathname !== '/' && (
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                    )}
                    {/* Show "Examples" link only if not on the examples page */}
                    {location.pathname !== '/examples' && (
                        <li>
                            <Link to="/examples">Examples</Link>
                        </li>
                    )}

                    {/* If user is logged in, show Dashboard and Logout, else show Login and Register */}
                    {token ? (
                        <>
                            <li>
                                <Link to="/dashboard">Dashboard</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login">Login</Link>
                            </li>
                            <li>
                                <Link to="/register">Register</Link>
                            </li>
                        </>
                    )}

                </ul>
            </nav>
        </header>
    );
};

export default Header;
