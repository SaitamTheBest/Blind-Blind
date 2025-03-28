// src/components/games/hint/HintPopup.tsx

import React from 'react';
import "../../../styles/games/classic/GuessInput.css";

interface HintPopupProps {
    isOpen: boolean;
    onClose: () => void;
    children: React.ReactNode;
    title: string;
}

const HintPopup: React.FC<HintPopupProps> = ({ isOpen, onClose, children, title }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>{title}</h2>
                <div className="track-info">
                    {children}
                </div>
                <button className="close-button" onClick={onClose}>Fermer</button>
            </div>
        </div>
    );
};

export default HintPopup;
