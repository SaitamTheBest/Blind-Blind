// src/components/games/hint/HintNationality.tsx

import React from 'react';
import HintPopup from './HintPopup';

interface Props {
    isOpen: boolean;
    nationality: string;
    onClose: () => void;
}

const HintNationality: React.FC<Props> = ({ isOpen, nationality, onClose }) => {
    return (
        <HintPopup isOpen={isOpen} onClose={onClose} title="💡 Indice nationalité">
            <p style={{ fontSize: "18px", textAlign: "center" }}>
                Nationalité : <strong>{nationality}</strong>
            </p>
        </HintPopup>
    );
};

export default HintNationality;
