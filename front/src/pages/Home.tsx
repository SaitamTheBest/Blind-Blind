import React, {useEffect} from "react";
import { useNavigate } from "react-router-dom";
import "../styles/home/home.css";

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Accueil - Blind-Blind";
    }, []);

    const handlePlayButtonClick = () => {
        navigate("/classic");
    };

    return (
        <div className="home">
            <h1 className="home-title">Jouer au Blind-Blind</h1>
            <p className="description">Cliquer sur le bouton "Play" pour commencer à jouer au jeu !</p>
            <button className="play-button" onClick={handlePlayButtonClick}>
                Play
            </button>
        </div>
    );
}
