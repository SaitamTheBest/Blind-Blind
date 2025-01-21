import React from 'react';
import logo from '../../res/Blind-Blind-logo-blanc.png'
import '../../styles/header/Header.css'
import {Link} from "react-router-dom";


const Header = () => {
    return(
        <header className="header">
            <div className="header-left">
                <img src={logo} alt="Blind-Blind Logo" className="logo" />
                <span className="site-name">Blind-Blind</span>
            </div>
            <nav className="nav">
                <Link to="/" className="nav-link">Accueil</Link>
                <Link to="/classic" className="nav-link">Mini-jeux</Link>
            </nav>
        </header>
    )
};

export default Header;