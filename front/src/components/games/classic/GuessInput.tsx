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


        if (term.length > 0) {
            setFilteredTracks(tracks.filter(track =>
                track.name.toLowerCase().includes(term) ||
                (track.artists).join(', ').toLowerCase().includes(term)
            ));
        } else {
            setFilteredTracks([]);
        }
    };

    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (guess.length > 0 && filteredTracks.length > 0) {
            onGuessSubmit(filteredTracks[0]);
            setGuess('');
            setSearchTerm('');
            setFilteredTracks([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (guess.length > 0 && filteredTracks.length > 0) {
                onGuessSubmit(filteredTracks[0]);
                setGuess('');
                setSearchTerm('');
                setFilteredTracks([]);
            }
        }
    };

    const handleTrackSelect = (track: any) => {
        setGuess('');
        setSearchTerm('');
        setFilteredTracks([]);
        onGuessSubmit(track);
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
            <button type="submit" className="guess-submit" disabled={disabled || guess.length === 0}>
                Envoyer
            </button>
            {searchTerm && filteredTracks.length > 0 && (
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
