import React from 'react';
import HintPopup from './HintPopup';

interface Props {
    isOpen: boolean;
    performer_type: string | undefined;
    onClose: () => void;
}

const getHintText = (type?: string): string => {
    if (!type) return "Type d'interprète inconnu.";

    switch (type.toLowerCase()) {
        case "homme":
            return "L'artiste qui chante cette musique est un homme! 🎶🎶";
        case "femme":
            return "L'artiste qui chante cette musique est une femme! 🎶🎶";
        case "groupe":
            return "Cette chanson est interprétée par un groupe! 🎶🎶";
        case "featuring":
            return "Les artistes de cette chanson sont en featuring! 🎶🎶";
        default:
            return "Type d'interprète inconnu.";
    }
};

const HintPerformer: React.FC<Props> = ({ isOpen, performer_type, onClose }) => {
    return (
        <HintPopup isOpen={isOpen} onClose={onClose} title="💡 Indice Artiste(s)">
            <p style={{ fontSize: "18px", textAlign: "center" }}>
                {getHintText(performer_type)}
            </p>
        </HintPopup>
    );
};

export default HintPerformer;
