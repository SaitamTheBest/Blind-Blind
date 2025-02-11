import React, { useState, useEffect } from "react";
import "../../../styles/games/classic/GuessInput.css";

type GuessInputProps = {
    onGuessSubmit: (track: any) => void;
    tracks: any[];
    disabled: boolean;
};

const GuessInput: React.FC<GuessInputProps> = ({ onGuessSubmit, tracks, disabled }) => {
    const [guess, setGuess] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredTracks, setFilteredTracks] = useState<any[]>([]);

    useEffect(() => {
        setFilteredTracks(tracks);
    }, [tracks]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setGuess(e.target.value);
        setSearchTerm(term);
        setFilteredTracks(tracks.filter(track =>
            track.name.toLowerCase().includes(term) ||
            (track.artists).join(', ').toLowerCase().includes(term)
        ));
    };

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        if (e) e.preventDefault();
        if (filteredTracks.length > 0) {
            onGuessSubmit(filteredTracks[0]);
            setGuess('');
            setSearchTerm('');
            setFilteredTracks([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && filteredTracks.length > 0) {
            e.preventDefault();
            onGuessSubmit(filteredTracks[0]);
            setGuess('');
            setSearchTerm('');
            setFilteredTracks([]);
        }
    };

    const handleTrackSelect = (track: any) => {
        if (filteredTracks.length > 0) {
            setGuess('');
            setSearchTerm('');
            setFilteredTracks([]);
            onGuessSubmit(track);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="guess-form">
            <input
                type="text"
                className="guess-input"
                value={guess}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Mettez le titre d'une chanson ici..."
                disabled={disabled}
            />
            <button type="submit" className="guess-submit" disabled={disabled}>
                Envoyer
            </button>
            {searchTerm && (
                <ul className="autocomplete-list">
                    {filteredTracks.map((track, index) => (
                        <li key={index} onClick={() => handleTrackSelect(track)}>
                            {track.name} - {(track.artists).join(', ')}
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default GuessInput;