import React from 'react';
import '../../styles/games/hint.css';
import HintPopup from './hint/HintPopup';

interface HintProps {
    isOpen: boolean;
    hint: string;
    onClose: () => void;
}

const HintText: React.FC<HintProps> = ({ isOpen, hint, onClose }) => {
    if (!isOpen) return null;
    return (
        <HintPopup isOpen={isOpen} onClose={onClose} title="💡 Indice Artiste(s)">
            <p style={{ fontSize: "18px", textAlign: "center" }}>
                <span>{hint}</span>
            </p>
        </HintPopup>
    );
};

export default HintText;
