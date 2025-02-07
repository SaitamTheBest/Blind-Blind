import React, { useState } from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import '../styles/games/classic/classic.css';

const ClassicMode: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);

    const handleGuessSubmit = (guess: string) => {
        if (guess.trim() !== '') {
            setMessages([guess, ...messages]); // Ajouter le nouveau message en haut
        }
    };

    return (
        <div className="classic-container">
            <div className="content">
                <h1>Devinez la chanson !</h1>
                <div>
                    <GuessInput onGuessSubmit={handleGuessSubmit} />
                    <h3>Propositions :</h3>
                    <AnswersTable messages={messages} />
                </div>
            </div>
        </div>
    );
};

export default ClassicMode;
