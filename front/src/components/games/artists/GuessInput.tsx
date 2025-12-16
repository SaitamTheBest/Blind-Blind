import React, { useState, useEffect } from "react";
import "../../../styles/games/classic/GuessInput.css";

type GuessInputProps = {
    onGuessSubmit: (artist: any) => void;
    artists: any[];
    disabled: boolean;
};

const GuessInput: React.FC<GuessInputProps> = ({ onGuessSubmit, artists, disabled }) => {
    const [guess, setGuess] = useState<string>('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArtists, setFilteredArtists] = useState<any[]>([]);

    useEffect(() => {
        setFilteredArtists(artists);
    }, [artists]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value.toLowerCase();
        setGuess(e.target.value);
        setSearchTerm(term);

        if (term.length > 0) {
            setFilteredArtists(
                artists.filter(artist => artist.name.toLowerCase().includes(term))
            );
        } else {
            setFilteredArtists([]);
        }
    };


    const handleSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        if (guess.length > 0 && filteredArtists.length > 0) {
            onGuessSubmit(filteredArtists[0]);
            setGuess('');
            setSearchTerm('');
            setFilteredArtists([]);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (guess.length > 0 && filteredArtists.length > 0) {
                onGuessSubmit(filteredArtists[0]);
                setGuess('');
                setSearchTerm('');
                setFilteredArtists([]);
            }
        }
    };

    const handleArtistSelect = (artist: any) => {
        setGuess('');
        setSearchTerm('');
        setFilteredArtists([]);
        onGuessSubmit(artist);
    };

    return (
        <form onSubmit={handleSubmit} className="guess-form">
            <input
                type="text"
                className="guess-input"
                value={guess}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Mettez le nom d'un artiste ici..."
                disabled={disabled}
            />
            <button type="submit" className="guess-submit" disabled={disabled || guess.length === 0}>
                <img src="/Blind-Blind-logo-blanc.png" alt="Submit" className="guess-submit-icon" />
            </button>
            {searchTerm && filteredArtists.length > 0 && (
                <ul className="autocomplete-list">
                    {filteredArtists.map((artist, index) => (
                        <li key={index} className="autocomplete-item" onClick={() => handleArtistSelect(artist)}>
                            <span className="artist-info">{artist.name}</span>
                        </li>
                    ))}
                </ul>
            )}
        </form>
    );
};

export default GuessInput;
