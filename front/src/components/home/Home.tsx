import React from "react";
import "../../styles/home/home.css";

export default function  Home() {
    return (
        <div className="home">
            <h1 className="home-title">Jouer au Blind-Blind</h1>
            <p className="description">Cliquer sur le bouton "Play" pour commencer à jouer au jeu !</p>
            <button className="play-button" role="button">
                Play
            </button>
        </div>
    );
}