import React, { useContext, useEffect, useRef, useState } from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import Popup from '../components/games/classic/SuccessPopup';
import '../styles/games/classic/classic.css';
import { GameContext } from "../components/games/context/GameContext";
import HintImage from "../components/games/hint/HintImage";
import HintPerformer from "../components/games/hint/HintPerformer";
import '../styles/games/hint.css';

enum CategoryGuessResponse {
    Correct = 'correct',
    MidCorrect = 'mid-correct',
    Incorrect = 'incorrect'
}

const ClassicMode: React.FC = () => {
    const [tracks, setTracks] = useState<any[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [hintNatOpen, setHintNatOpen] = useState(false);
    const [hintImgOpen, setHintImgOpen] = useState(false);
    const isMounted = useRef(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const gameContext = useContext(GameContext);
    if (!gameContext) {
        throw new Error("GameContext must be used within a GameProvider");
    }

    const { messages, setMessages, attempts, setAttempts, randomTrack, setRandomTrack } = gameContext;

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const lastWinDate = localStorage.getItem('lastWinDate');
        const lastSavedDate = localStorage.getItem('savedDate');

        document.title = "Classic - Blind-Blind";

        if (lastSavedDate !== getTodayDate()) {
            localStorage.removeItem('lastWinDate');
            localStorage.setItem('savedDate', getTodayDate());
        } else {
            if (lastWinDate === getTodayDate()) {
                setGameEnded(true);
                setPopupOpen(true);
            }
        }

        localStorage.setItem('songOfTheDay', JSON.stringify(randomTrack));

    }, [randomTrack]);

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
            nationality: track.nationality,
            genres: track.genres,
            followers: track.followers,
            popularity: track.popularity,
            release_year: track.release_year,
            isCorrect: {
                name: verificateItem(randomTrack.name, track.name),
                artists: verificateItem(randomTrack.artists, track.artists),
                nationality: verificateItem(randomTrack.nationality, track.nationality),
                genres: verificateItem(randomTrack.genres, track.genres),
                album: verificateItem(randomTrack.album, track.album),
                followers: verificateItem(randomTrack.followers, track.followers),
                popularity: verificateItem(randomTrack.popularity, track.popularity),
                release_date: verificateItem(randomTrack.release_year, track.release_year),
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
            const columns = 7; // nb de colonnes dans ta table
            const delayPerCell = 500; // durée d'apparition d'une cellule (ms)
            const delayBeforePopup = columns * delayPerCell + 300; // petit offset de sécurité

            setGameEnded(true);
            localStorage.setItem('lastWinDate', getTodayDate());

            setTimeout(() => {
                setPopupOpen(true);
            }, delayBeforePopup);
        }
    };

    useEffect(() => {
        isMounted.current = true;
        fetchSongOfTheDay();
        fetchTracks();
        return () => {
            isMounted.current = false;
        };
    }, []);

    const fetchSongOfTheDay = async () => {
        try {
            const apiUrl = window._env_?.REACT_APP_URL_API ?? process.env.REACT_APP_URL_API;

            const response = await fetch(`${apiUrl}/api/tracks/song-of-the-day`);
            if (!response.ok) {
                console.error('Erreur lors de la récupération de la chanson du jour', response);
                return;
            }
            const songOfTheDay = await response.json();

            setRandomTrack(songOfTheDay);
            localStorage.setItem('randomTrack', JSON.stringify(songOfTheDay));
            localStorage.setItem('trackDate', getTodayDate());
        } catch (error) {
            console.error('Erreur lors de la récupération de la chanson du jour', error);
        }
    };

    const fetchTracks = async () => {
        try {
            const apiUrl = window._env_?.REACT_APP_URL_API ?? process.env.REACT_APP_URL_API;

            setIsLoading(true);
            const response = await fetch(`${apiUrl}/api/tracks/all-tracks`);
            if (!response.ok) {
                console.error('Réponse du serveur incorrecte :', response);
                return;
            }
            const data = await response.json();

            if (isMounted.current) {
                const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses") || "[]");
                const filteredTracks = data.filter((track: { name: any; }) => !previousGuesses.includes(track.name));
                setTracks(filteredTracks);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des musiques :', error);
        } finally {
            setIsLoading(false);
        }
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
                    {gameEnded && <h4 className="blocked-message">Tu as déjà trouvé la chanson du jour en {attempts} essais. Reviens demain ! 🎵</h4>}
                    <p>Nombre d'essais : {attempts}</p>

                    <div className="hint-buttons">
                        <button
                            className={`hint-button ${attempts >= 3 ? 'unlocked' : 'locked'}`}
                            onClick={() => {
                                if (attempts >= 3) {
                                    setHintNatOpen(true);
                                }
                            }}
                            data-tooltip="Débloqué après 3 essais"
                        >
                            1
                        </button>

                        <button
                            className={`hint-button ${attempts >= 8 ? 'unlocked' : 'locked'}`}
                            onClick={() => {
                                if (attempts >= 8) {
                                    setHintImgOpen(true);
                                }
                            }}
                            data-tooltip="Débloqué après 8 essais"
                        >
                            2
                        </button>
                    </div>

                    <GuessInput onGuessSubmit={handleGuessSubmit} tracks={tracks} disabled={gameEnded} />

                    <h3>Propositions :</h3>
                    <AnswersTable messages={messages} randomTrack={randomTrack} />
                </div>
            )}

            <Popup
                isOpen={popupOpen}
                trackDetails={randomTrack}
                onClose={() => setPopupOpen(false)}
            />
            <HintPerformer
                isOpen={hintNatOpen}
                performer_type={randomTrack?.performer_type}
                onClose={() => setHintNatOpen(false)}
            />

            <HintImage
                isOpen={hintImgOpen}
                imageUrl={randomTrack?.image_artist}
                onClose={() => setHintImgOpen(false)}
            />
        </div>
    );
};

export default ClassicMode;
