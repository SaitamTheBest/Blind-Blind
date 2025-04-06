import React from "react";
import "../../styles/footer/footer.css";

export default function  Footer() {
    return (
        <footer>
            <p>Nos réseaux sociaux :</p>
            <div className="social-media">
                <a href="https://x.com/BlindBlind_Off" aria-label="Twitter page">
                    <img src="https://img.icons8.com/?size=100&id=6Fsj3rv2DCmG&format=png&color=ffffff" alt="Twitter"/>
                </a>
                <a href="https://www.instagram.com/blindblind_off?igsh=MXQwMGF6aXEzMmEz" aria-label="Instagram page">
                    <img src="https://img.icons8.com/?size=100&id=32292&format=png&color=ffffff" alt="Instagram"/>
                </a>
                <a href="https://discord.gg/bMFeHyfKut" aria-label="Discord server">
                    <img src="https://img.icons8.com/?size=100&id=25627&format=png&color=ffffff" alt="Discord"/>
                </a>
            </div>
        </footer>
    );
}