import React, {useState} from "react";

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
        <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
            <input
                type="text"
                value={guess}
                onChange={handleChange}
                placeholder="Mettez le titre d'une chanson ici..."
                style={{ padding: '10px', fontSize: '16px', width: '80%' }}
            />
            <button type="submit" style={{ padding: '10px 20px', marginLeft: '10px' }}>
                Envoyer
            </button>
        </form>
    );
};

export default GuessInput;
