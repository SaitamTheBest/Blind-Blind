import React from 'react';
import "../../../styles/games/classic/GuessInput.css";

interface PopupProps {
    isOpen: boolean;
    trackDetails: any;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, trackDetails, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Félicitations 🎉</h2>
                <p>Vous avez trouvé la bonne chanson !</p>
                <div className="track-info">
                    <img src={trackDetails.image || ''} alt="Album cover" className="album-image" />
                    <h3>{trackDetails.name}</h3>
                    <p><strong>Artistes :</strong> {Array.isArray(trackDetails.artists) ? trackDetails.artists.join(', ') : trackDetails.artists || "Inconnu"}</p>
                    <p><strong>Album :</strong> {trackDetails.album}</p>
                    <p><strong>Date de sortie :</strong> {trackDetails.release_date}</p>
                </div>
                <button className="close-button" onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

export default Popup;
