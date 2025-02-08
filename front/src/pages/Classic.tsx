import React, {useEffect, useState, useRef} from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import '../styles/games/classic/classic.css';

const ClassicMode: React.FC = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [randomTrack, setRandomTrack] = useState<any>(null);
    const isMounted = useRef(false);

    const handleGuessSubmit = (guess: string) => {
        if (guess.trim() !== '') {
            setMessages([guess, ...messages]); // Ajouter le nouveau message en haut
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchRandomTrack();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchRandomTrack = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/tracks/random-track');

            if (!response.ok) {
                console.error('Réponse du serveur incorrecte :', response);
                return;
            }

            const data = await response.json();

            console.log('Données reçues :', data);

            if (isMounted.current) {
                setRandomTrack(data);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la musique :', error);
        }
    };

    return (
        <div className="classic-container">
            <div className="content">
                <h1>Devinez la chanson !</h1>
                <div>
                    <GuessInput onGuessSubmit={handleGuessSubmit} />
                    <h3>Propositions :</h3>
                    <AnswersTable messages={messages} randomTrack={randomTrack} />
                </div>
            </div>
        </div>
    );
};

export default ClassicMode;