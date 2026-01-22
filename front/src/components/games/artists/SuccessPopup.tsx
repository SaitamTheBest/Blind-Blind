import React from 'react';
import "../../../styles/games/artists/SuccessPopup.css";

interface PopupProps {
    isOpen: boolean;
    artistDetails: any | null;
    onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, artistDetails, onClose }) => {
    if (!isOpen || !artistDetails) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Félicitations 🎉</h2>
                <p>Vous avez trouvé le bon artiste ! Il s'agissait bien de {artistDetails.name}.</p>
                <h4>Revenez demain pour une nouvelle partie ! 📀</h4>
                <div className="artist-info">
                    <img src={artistDetails.image || ''} alt="Artist cover" className="artist-image" />
                </div>
                <button className="close-button" onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

export default Popup;
