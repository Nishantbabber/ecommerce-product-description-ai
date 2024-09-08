import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/header.css';

const Header = () => {
    const location = useLocation();
    const token = localStorage.getItem('token');
    const [menuOpen, setMenuOpen] = useState(false);

    const handleToggle = () => {
        setMenuOpen(!menuOpen);
    };

    return (
        <header className="header">
            <div className="logo">
                <Link to="/">AIProductWriter</Link>
            </div>

            <div className="menu-toggle" onClick={handleToggle}>
                &#9776; {/* Hamburger icon */}
            </div>

            <nav>
                <ul className={`nav-links ${menuOpen ? 'show' : ''}`}>
                    {location.pathname !== '/' && (
                        <li>
                            <Link to="/" onClick={handleToggle}>Home</Link>
                        </li>
                    )}
                    {location.pathname !== '/examples' && (
                        <li>
                            <Link to="/examples" onClick={handleToggle}>Examples</Link>
                        </li>
                    )}
                    
                    {token ? (
                        <>
                            <li>
                                <Link to="/dashboard" onClick={handleToggle}>Dashboard</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link to="/login" onClick={handleToggle}>Login</Link>
                            </li>
                            <li>
                                <Link to="/register" onClick={handleToggle}>Register</Link>
                            </li>
                        </>
                    )}

                    {location.pathname !== '/contactUs' && (
                        <li>
                            <Link to="/contactUs" onClick={handleToggle}>Contact Us</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
