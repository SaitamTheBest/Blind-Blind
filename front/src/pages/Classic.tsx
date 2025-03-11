import React, {useContext, useEffect, useRef, useState} from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import Popup from '../components/games/classic/Popup';
import '../styles/games/classic/classic.css';
import { GameContext } from "../components/games/context/GameContext";

enum CategoryGuessResponse {
    Correct = 'correct',
    MidCorrect = 'mid-correct',
    Incorrect = 'incorrect'
}

const ClassicMode: React.FC = () => {
    const [tracks, setTracks] = useState<any[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const isMounted = useRef(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const gameContext = useContext(GameContext);
    if (!gameContext) {
        throw new Error("GameContext must be used within a GameProvider");
    }

    const { messages, setMessages, attempts, setAttempts, randomTrack, setRandomTrack } = gameContext;


    const getTodayDate = (): string => {
        return new Date().toISOString().split('T')[0];
    };

    useEffect(() => {
        const lastWinDate = localStorage.getItem('lastWinDate');
        const storedAttempts = localStorage.getItem('attempts');
        const lastSavedDate = localStorage.getItem('savedDate');
        document.title = "Classic - Blind-Blind";


        if (lastSavedDate !== getTodayDate()) {
            console.log("Nouveau jour détecté, réinitialisation des données...");
            localStorage.removeItem('lastWinDate');
            localStorage.removeItem('attempts');
            localStorage.setItem('savedDate', getTodayDate());
            setGameEnded(false);
            setAttempts(0);
        } else {
            if (lastWinDate === getTodayDate()) {
                setGameEnded(true);
                setPopupOpen(true);
            }
            if (storedAttempts) {
                setAttempts(parseInt(storedAttempts, 10));
            }
        }
    }, []);

    const verificateItem = (correctItem: any, item: any): CategoryGuessResponse => {
        if (item === correctItem) {
            return CategoryGuessResponse.Correct;
        } else if (Array.isArray(item) && Array.isArray(correctItem)) {
            const itemSet = new Set(item);
            const correctItemSet = new Set(correctItem);
            if (itemSet.size === correctItemSet.size && [...itemSet].every(i => correctItemSet.has(i))) {
                return CategoryGuessResponse.Correct;
            } else if (item.some((i: any) => correctItem.includes(i))) {
                return CategoryGuessResponse.MidCorrect;
            }
        }
        return CategoryGuessResponse.Incorrect;
    };

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }
    }, []);

    const handleGuessSubmit = (track: any) => {
        if (gameEnded || !track || !track.name) return;

        const newAttempts = attempts + 1;
        setAttempts(newAttempts);
        localStorage.setItem('attempts', newAttempts.toString());

        const guessDetails = {
            name: track.name,
            artists: track.artists,
            album: track.album,
            genres: track.genres,
            popularity: track.popularity,
            release_year: track.release_year,
            isCorrect: {
                name: verificateItem(randomTrack.name, track.name),
                artists: verificateItem(randomTrack.artists, track.artists),
                genres: verificateItem(randomTrack.genres, track.genres),
                album: verificateItem(randomTrack.album, track.album),
                popularity: verificateItem(randomTrack.popularity, track.popularity),
                release_date: verificateItem(randomTrack.release_year, track.release_year)
            }
        };

        const updatedMessages = [guessDetails, ...messages];
        setMessages(updatedMessages);
        localStorage.setItem("messages", JSON.stringify(updatedMessages));

        const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses") || "[]");
        const updatedGuesses = [...previousGuesses, track.name];
        localStorage.setItem("previousGuesses", JSON.stringify(updatedGuesses));

        setTracks((prevTracks) => prevTracks.filter(t => t.name !== track.name));

        if (track.name === randomTrack.name) {
            setPopupOpen(true);
            setGameEnded(true);
            localStorage.setItem('lastWinDate', getTodayDate());
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
            setIsLoading(true);
            const response = await fetch('http://localhost:3001/api/tracks/all-tracks');

            if (!response.ok) {
                console.error('Réponse du serveur incorrecte :', response);
                return;
            }

            const data = await response.json();

            if (isMounted.current) {
                const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses") || "[]");

                const filteredTracks = data.filter((track: { name: any; }) => !previousGuesses.includes(track.name));

                setTracks(filteredTracks);

                const savedTrack = localStorage.getItem('randomTrack');
                const lastTrackDate = localStorage.getItem('trackDate');

                if (savedTrack && lastTrackDate === getTodayDate()) {
                    setRandomTrack(JSON.parse(savedTrack));
                } else {
                    const randomIndex = Math.floor(Math.random() * filteredTracks.length);
                    const chosenTrack = filteredTracks[randomIndex];

                    setRandomTrack(chosenTrack);
                    localStorage.setItem('randomTrack', JSON.stringify(chosenTrack));
                    localStorage.setItem('trackDate', getTodayDate());
                }
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de la musique :', error);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCache = () => {
        localStorage.removeItem('lastWinDate');
        localStorage.removeItem('attempts');
        localStorage.removeItem('savedDate');
        localStorage.removeItem('previousGuesses');
        localStorage.removeItem('randomTrack');
        localStorage.removeItem('trackDate');
        localStorage.removeItem('messages');
        window.location.reload();
    };

    return (
        <div className="classic-container">
            {isLoading ? (
                <div className="loading">
                    <div className="spinner"></div>
                    <p className="loading-message">Chargement en cours...</p>
                </div>
            ) : (
                <div className="content">
                    <h1>Devinez la chanson !</h1>
                    {gameEnded && <p className="blocked-message">Tu as déjà trouvé la chanson du jour en {attempts} essais. Reviens demain ! 🎵</p>}
                    <p>Nombre d'essais : {attempts}</p>
                    <GuessInput onGuessSubmit={handleGuessSubmit} tracks={tracks} disabled={gameEnded} />
                    <h3>Propositions :</h3>
                    <AnswersTable messages={messages} randomTrack={randomTrack} />
                    <button onClick={clearCache} className="reset-button">
                        Réinitialiser le jeu
                    </button>
                </div>
            )}

            <Popup
                isOpen={popupOpen}
                trackDetails={randomTrack}
                onClose={() => setPopupOpen(false)}
            />
        </div>
    );
};

export default ClassicMode;