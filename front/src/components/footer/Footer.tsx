import React from "react";
import "../../styles/footer/footer.css";

export default function  Footer() {
    return (
        <footer>
            <p>Nos réseaux sociaux :</p>
            <div className="social-media">
                <a href="https://www.twitter.com" aria-label="Twitter">
                    <img src="https://img.icons8.com/ios-filled/24/ffffff/twitter.png" alt="Twitter"/>
                </a>
                <a href="https://www.instagram.com" aria-label="Instagram">
                    <img src="https://img.icons8.com/ios-filled/24/ffffff/instagram-new.png" alt="Instagram"/>
                </a>
                <a href="https://www.discord.com" aria-label="Discord">
                    <img src="https://img.icons8.com/ios-filled/24/ffffff/discord.png" alt="Discord"/>
                </a>
            </div>
        </footer>
    );
}