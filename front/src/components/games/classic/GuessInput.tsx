import React, { useState } from "react";


const GuessInput = () => {
    const [guess, setGuess] = useState<string>("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setGuess(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setGuess("");
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={guess}
                onChange={handleChange}
                placeholder="Entrez le nom de la chanson..."
                style={{ padding: "10px", fontSize: "16px", width: "80%" }}
            />
            <button type="submit" style={{ padding: "10px 20px", marginLeft: "10px" }}>
                Valider
            </button>
        </form>
    );
};

export default GuessInput;
