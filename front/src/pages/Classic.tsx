import React, { useContext, useEffect, useRef, useState } from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import Popup from '../components/games/classic/SuccessPopup';
import '../styles/games/classic/classic.css';
import { GameContext } from "../components/games/context/ClassicGameContext";
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

    const { messagesClassic, setMessagesClassic, attemptsClassic, setAttemptsClassic, randomTrackClassic, setRandomTrackClassic } = gameContext;

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const lastWinClassicDate = localStorage.getItem('lastWinClassicDate');
        const lastSavedDateClassic = localStorage.getItem('savedDateClassic');

        document.title = "Classic - Blind-Blind";

        if (lastSavedDateClassic !== getTodayDate()) {
            localStorage.removeItem('lastWinClassicDate');
            localStorage.setItem('savedDateClassic', getTodayDate());
        } else {
            if (lastWinClassicDate === getTodayDate()) {
                setGameEnded(true);
                setPopupOpen(true);
            }
        }

        localStorage.setItem('songOfTheDay', JSON.stringify(randomTrackClassic));
    }, [randomTrackClassic]);

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
        const savedMessagesClassic = localStorage.getItem("messagesClassic");
        if (savedMessagesClassic) {
            setMessagesClassic(JSON.parse(savedMessagesClassic));
        }
    }, []);

    const handleGuessSubmit = (track: any) => {
        if (gameEnded || !track || !track.name) return;

        const newAttempts = attemptsClassic + 1;
        setAttemptsClassic(newAttempts);
        localStorage.setItem('attemptsClassic', newAttempts.toString());

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
                name: verificateItem(randomTrackClassic.name, track.name),
                artists: verificateItem(randomTrackClassic.artists, track.artists),
                nationality: verificateItem(randomTrackClassic.nationality, track.nationality),
                genres: verificateItem(randomTrackClassic.genres, track.genres),
                album: verificateItem(randomTrackClassic.album, track.album),
                followers: verificateItem(randomTrackClassic.followers, track.followers),
                popularity: verificateItem(randomTrackClassic.popularity, track.popularity),
                release_date: verificateItem(randomTrackClassic.release_year, track.release_year),
            }
        };

        const updatedMessages = [guessDetails, ...messagesClassic];
        setMessagesClassic(updatedMessages);
        localStorage.setItem("messagesClassic", JSON.stringify(updatedMessages));

        const previousGuesses = JSON.parse(localStorage.getItem("previousGuessesClassic") || "[]");
        const updatedGuesses = [...previousGuesses, track.name];
        localStorage.setItem("previousGuessesClassic", JSON.stringify(updatedGuesses));

        setTracks((prevTracks) => prevTracks.filter(t => t.name !== track.name));

        if (track.name === randomTrackClassic.name) {
            const columns = 7; // nb de colonnes dans ta table
            const delayPerCell = 500; // durée d'apparition d'une cellule (ms)
            const delayBeforePopup = columns * delayPerCell + 300; // petit offset de sécurité

            setGameEnded(true);
            localStorage.setItem('lastWinClassicDate', getTodayDate());

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

            setRandomTrackClassic(songOfTheDay);
            localStorage.setItem('randomTrackClassic', JSON.stringify(songOfTheDay));
            localStorage.setItem('trackDateClassic', getTodayDate());
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
                const previousGuesses = JSON.parse(localStorage.getItem("previousGuessesClassic") || "[]");
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
                    {gameEnded && <h4 className="blocked-message">Tu as déjà trouvé la chanson du jour en {attemptsClassic} essais. Reviens demain ! 🎵</h4>}
                    <p>Nombre d'essais : {attemptsClassic}</p>

                    <div className="hint-buttons">
                        <button
                            className={`hint-button ${attemptsClassic >= 3 ? 'unlocked' : 'locked'}`}
                            onClick={() => {
                                if (attemptsClassic >= 3) {
                                    setHintNatOpen(true);
                                }
                            }}
                            data-tooltip="Débloqué après 3 essais"
                        >
                            1
                        </button>

                        <button
                            className={`hint-button ${attemptsClassic >= 8 ? 'unlocked' : 'locked'}`}
                            onClick={() => {
                                if (attemptsClassic >= 8) {
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
                    <AnswersTable messagesClassic={messagesClassic} randomTrackClassic={randomTrackClassic} />
                </div>
            )}

            <Popup
                isOpen={popupOpen}
                trackDetails={randomTrackClassic}
                onClose={() => setPopupOpen(false)}
            />
            <HintPerformer
                isOpen={hintNatOpen}
                performer_type={randomTrackClassic?.performer_type}
                onClose={() => setHintNatOpen(false)}
            />

            <HintImage
                isOpen={hintImgOpen}
                imageUrl={randomTrackClassic?.image_artist}
                onClose={() => setHintImgOpen(false)}
            />
        </div>
    );
};

export default ClassicMode;
