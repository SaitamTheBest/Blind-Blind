// src/components/games/hint/HintImage.tsx

import React from 'react';
import HintPopup from './HintPopup';

interface Props {
    isOpen: boolean;
    imageUrl: string;
    onClose: () => void;
}

const HintImage: React.FC<Props> = ({ isOpen, imageUrl, onClose }) => {
    return (
        <HintPopup isOpen={isOpen} onClose={onClose} title="💡 Indice visuel">
            <img
                src={imageUrl}
                alt="Indice visuel"
                style={{
                    width: '100%',
                    maxWidth: '300px',
                    height: 'auto',
                    display: 'block',
                    margin: '20px auto',
                    borderRadius: '10px'
                }}
            />
        </HintPopup>
    );
};

export default HintImage;
