import React, { useState, useEffect } from 'react';
import logo from '../../res/Blind-Blind-logo-blanc.png';
import '../../styles/header/Header.css';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }, [isMenuOpen]);

    return (
        <>
            <header className="header">
                <Link to="/" className="header-left">
                    <img src={logo} alt="Blind-Blind Logo" className="logo" />
                    <span className="site-name">Blind-Blind</span>
                </Link>
                <nav className="nav desktop-nav">
                    <Link to="/" className="nav-link">Accueil</Link>
                    <Link to="/classic" className="nav-link">Classic</Link>
                </nav>
                <div className="slide" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                    ☰
                </div>
            </header>

            {/* Overlay de fond du site*/}
            {isMenuOpen && <div className="backdrop" onClick={() => setIsMenuOpen(false)}></div>}

            {/* Volet latéral qui n'est que pour les téléphones en mode portrait */}
            <div className={`mobile-menu ${isMenuOpen ? 'open' : ''}`}>
                <button className="close-btn" onClick={() => setIsMenuOpen(false)}>✕</button>
                <Link to="/" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Accueil</Link>
                <Link to="/classic" className="mobile-link" onClick={() => setIsMenuOpen(false)}>Mini-jeux</Link>
            </div>
        </>
    );
};

export default Header;
