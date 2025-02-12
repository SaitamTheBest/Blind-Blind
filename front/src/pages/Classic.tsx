import React, { useEffect, useRef, useState } from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import Popup from '../components/games/classic/Popup';
import '../styles/games/classic/classic.css';

enum CategoryGuessResponse {
    Correct = 'correct',
    MidCorrect = 'mid-correct',
    Incorrect = 'incorrect'
}

const ClassicMode: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [tracks, setTracks] = useState<any[]>([]);
    const [randomTrack, setRandomTrack] = useState<any>(null);
    const [popupOpen, setPopupOpen] = useState(false);
    const isMounted = useRef(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [attempts, setAttempts] = useState(0);

    // Récupérer la date du jour
    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    // Vérifier si l'utilisateur a déjà trouvé la musique aujourd'hui et récupérer les essais
    useEffect(() => {
        const lastWinDate = localStorage.getItem('lastWinDate');
        const storedAttempts = localStorage.getItem('attempts');

        if (lastWinDate === getTodayDate()) {
            setGameEnded(true);
            setPopupOpen(true);
        }

        if (storedAttempts) {
            setAttempts(parseInt(storedAttempts, 10));
        }
    }, []);

    const verificateItem = (correctItem: any, item: any): CategoryGuessResponse => {
        if (item === correctItem) {
            return CategoryGuessResponse.Correct;
        } else if (Array.isArray(item) && Array.isArray(correctItem)) {
            const itemSet = new Set(item);
            const correctItemSet = new Set(correctItem);
            // @ts-ignore
            if (itemSet.size === correctItemSet.size && [...itemSet].every(i => correctItemSet.has(i))) {
                return CategoryGuessResponse.Correct;
            } else if (item.some((i: any) => correctItem.includes(i))) {
                return CategoryGuessResponse.MidCorrect;
            }
        }
        return CategoryGuessResponse.Incorrect;
    };

    const handleGuessSubmit = (track: any) => {
        if (gameEnded || !track || !track.name) return;

        // Incrémentation des essais
        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('attempts', newAttempts.toString()); // Sauvegarde du nombre d'essais

        const guessDetails = {
            name: track.name,
            artists: track.artists,
            album: track.album,
            genres: track.genres,
            popularity: track.popularity,
            release_date: track.release_date,
            isCorrect: {
                name: verificateItem(randomTrack.name, track.name),
                artists: verificateItem(randomTrack.artists, track.artists),
                genres: verificateItem(randomTrack.genres, track.genres),
                album: verificateItem(randomTrack.album, track.album),
                popularity: verificateItem(randomTrack.popularity, track.popularity),
                release_date: verificateItem(randomTrack.release_date, track.release_date)
            }
        };

        setMessages([guessDetails, ...messages]);
        setTracks(tracks.filter(t => t.name !== track.name));

        if (track.name === randomTrack.name) {
            setPopupOpen(true);
            setGameEnded(true);
            localStorage.setItem('lastWinDate', getTodayDate()); // Stocker la date de victoire
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchTracks();

        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchTracks = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/tracks/all-tracks');

            if (!response.ok) {
                console.error('Réponse du serveur incorrecte :', response);
                return;
            }

            const data = await response.json();

            if (isMounted.current) {
                setTracks(data);
                const randomIndex = Math.floor(Math.random() * data.length);
                setRandomTrack(data[randomIndex]);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la musique :', error);
        }
    };

    const clearCache = () => {
        localStorage.removeItem('lastWinDate');
        localStorage.removeItem('attempts');
        window.location.reload(); // Recharge la page
    };

    return (
        <div className="classic-container">
            <div className="content">
                <h1>Devinez la chanson !</h1>
                {gameEnded && <p className="blocked-message">Tu as déjà trouvé la chanson du jour en {attempts} essais. Reviens demain ! 🎵</p>}
                <p>Nombre d'essais : {attempts}</p>
                <GuessInput onGuessSubmit={handleGuessSubmit} tracks={tracks} disabled={gameEnded} />
                <h3>Propositions :</h3>
                <AnswersTable messages={messages} randomTrack={randomTrack} />

                {/* Bouton pour réinitialiser les tests */}
                <button onClick={clearCache} className="reset-button">
                    Réinitialiser le jeu
                </button>
            </div>

            <Popup
                isOpen={popupOpen}
                trackDetails={randomTrack}
                onClose={() => setPopupOpen(false)}
            />
        </div>
    );
};

export default ClassicMode;