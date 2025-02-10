import React, {useState} from "react";
import "../../../styles/games/classic/GuessInput.css";

type GuessInputProps = {
    onGuessSubmit: (guess: string) => void;
};

const GuessInput: React.FC<GuessInputProps> = ({ onGuessSubmit }) => {
    const [guess, setGuess] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuess(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (guess.trim() !== '') {
            onGuessSubmit(guess);
            setGuess('');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="guess-form">
            <input
                type="text"
                className="guess-input"
                value={guess}
                onChange={handleChange}
                placeholder="Mettez le titre d'une chanson ici..."
            />
            <button type="submit" className="guess-submit">
                <img src="/Blind-Blind-logo-blanc.png" alt="Submit" className="guess-submit-icon" />
            </button>
        </form>
    );
};

export default GuessInput;
