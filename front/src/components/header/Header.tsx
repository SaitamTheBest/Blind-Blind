import React from 'react';
import logo from '../../res/Blind-Blind-logo-blanc.png'
import '../../styles/header/Header.css'


const Header = () => {
    return(
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="Blind-Blind Logo" className="logo" />
                <span className="site-name">Blind-Blind</span>
            </div>
            <nav className="nav">
                <a href="#home" className="nav-link">Accueil</a>
                <a href="#games" className="nav-link">Mini-jeux</a>
            </nav>
        </header>
    )
};

export default Header;