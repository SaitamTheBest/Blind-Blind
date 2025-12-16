import React, { useContext, useEffect, useRef, useState } from 'react';
import GuessInput from '../components/games/artists/GuessInput';
import AnswersTable from '../components/games/artists/AnswersTable';
import Popup from '../components/games/artists/SuccessPopup';
import ArtistPixelImage from "../components/games/artists/ArtistPixelImage";
import '../styles/games/classic/classic.css';
import { ArtistGameContext } from "../components/games/context/ArtistGameContext";
import HintImage from "../components/games/hint/HintImage";
import HintPerformer from "../components/games/hint/HintPerformer";
import '../styles/games/hint.css';

enum CategoryGuessResponse {
    Correct = 'correct',
    Incorrect = 'incorrect'
}

const ArtistMode: React.FC = () => {
    const [artists, setArtists] = useState<any[]>([]);
    const [popupOpen, setPopupOpen] = useState(false);
    const [hintNatOpen, setHintNatOpen] = useState(false);
    const [hintBestTrack, setHintBestTrack] = useState(false);
    const isMounted = useRef(false);
    const [gameEnded, setGameEnded] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const gameContext = useContext(ArtistGameContext);
    if (!gameContext) {
        throw new Error("ArtistGameContext must be used within a ArtistGameProvider");
    }

    const { messagesArtist, setMessagesArtist, attemptsArtist, setAttemptsArtist, randomArtist, setRandomArtist } = gameContext;

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const lastWinDate = localStorage.getItem('lastWinDate');
        const lastSavedDate = localStorage.getItem('savedDate');

        document.title = "Artistes - Blind-Blind";

        if (lastSavedDate !== getTodayDate()) {
            localStorage.removeItem('lastWinDate');
            localStorage.setItem('savedDate', getTodayDate());
        } else {
            if (lastWinDate === getTodayDate()) {
                setGameEnded(true);
                setPopupOpen(true);
            }
        }

        localStorage.setItem('artistOfTheDay', JSON.stringify(randomArtist));

    }, [randomArtist]);

    const verificateItem = (correctItem: any, item: any): CategoryGuessResponse => {
        if (item === correctItem) {
            return CategoryGuessResponse.Correct;
        } else if (Array.isArray(item) && Array.isArray(correctItem)) {
            const itemSet = new Set(item);
            const correctItemSet = new Set(correctItem);
            if (itemSet.size === correctItemSet.size && [...itemSet].every(i => correctItemSet.has(i))) {
                return CategoryGuessResponse.Correct;
            }
        }
        return CategoryGuessResponse.Incorrect;
    };

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        if (savedMessages) {
            setMessagesArtist(JSON.parse(savedMessages));
        }
    }, []);

    const handleGuessSubmit = (artist: any) => {
        if (gameEnded || !artist || !artist.name) return;

        const newAttempts = attemptsArtist + 1;
        setAttemptsArtist(newAttempts);
        localStorage.setItem('attempts', newAttempts.toString());

        const guessDetails = {
            name: artist.name,
            isCorrect: {
                name: verificateItem(randomArtist.name, artist.name)
            }
        };

        const updatedMessages = [guessDetails, ...messagesArtist];
        setMessagesArtist(updatedMessages);
        localStorage.setItem("messages", JSON.stringify(updatedMessages));

        const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses") || "[]");
        const updatedGuesses = [...previousGuesses, artist.name];
        localStorage.setItem("previousGuesses", JSON.stringify(updatedGuesses));

        setArtists((prevArtists) => prevArtists.filter(a => a.name !== artist.name));

        if (artist.name === randomArtist.name) {
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

            const response = await fetch(`${apiUrl}/api/artists/artist-of-the-day`);
            if (!response.ok) {
                console.error('Erreur lors de la récupération de la chanson du jour', response);
                return;
            }
            const artistOfTheDay = await response.json();

            setRandomArtist(artistOfTheDay);
            localStorage.setItem('randomArtist', JSON.stringify(artistOfTheDay));
            localStorage.setItem('artistDate', getTodayDate());
        } catch (error) {
            console.error('Erreur lors de la récupération de la chanson du jour', error);
        }
    };

    const fetchTracks = async () => {
        try {
            const apiUrl = window._env_?.REACT_APP_URL_API ?? process.env.REACT_APP_URL_API;

            setIsLoading(true);
            const response = await fetch(`${apiUrl}/api/artists/all-artists`);
            if (!response.ok) {
                console.error('Réponse du serveur incorrecte :', response);
                return;
            }
            const data = await response.json();

            if (isMounted.current) {
                const previousGuesses = JSON.parse(localStorage.getItem("previousGuesses") || "[]");
                const filteredArtists = data.filter((artist: { name: any; }) => !previousGuesses.includes(artist.name));
                setArtists(filteredArtists);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des artistes :', error);
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
                    <h1>Devinez l'artiste !</h1>
                    {gameEnded && <h4 className="blocked-message">Tu as déjà trouvé l'artiste du jour en {attemptsArtist} essais. Reviens demain ! 🎵</h4>}
                    <p>Nombre d'essais : {attemptsArtist}</p>

                    {randomArtist?.image && (
                        <ArtistPixelImage
                            imageUrl={randomArtist.image}
                            attempts={attemptsArtist}
                            maxAttempts={10}
                        />
                    )}

                    <div className="hint-buttons">
                        <button
                            className={`hint-button ${attemptsArtist >= 3 ? 'unlocked' : 'locked'}`}
                            onClick={() => {
                                if (attemptsArtist >= 3) {
                                    setHintNatOpen(true);
                                }
                            }}
                            data-tooltip="Débloqué après 4 essais"
                        >
                            1
                        </button>

                        <button
                            className={`hint-button ${attemptsArtist >= 8 ? 'unlocked' : 'locked'}`}
                            onClick={() => {
                                if (attemptsArtist >= 8) {
                                    setHintBestTrack(true);
                                }
                            }}
                            data-tooltip="Débloqué après 6 essais"
                        >
                            2
                        </button>
                    </div>

                    <GuessInput onGuessSubmit={handleGuessSubmit} artists={artists} disabled={gameEnded} />

                    <h3>Propositions :</h3>
                    <AnswersTable messages={messagesArtist} randomArtist={randomArtist} />
                </div>
            )}

            <Popup
                isOpen={popupOpen}
                artistDetails={randomArtist}
                onClose={() => setPopupOpen(false)}
            />
            <HintPerformer
                isOpen={hintNatOpen}
                performer_type={randomArtist?.performer_type}
                onClose={() => setHintNatOpen(false)}
            />

            <HintImage
                isOpen={hintBestTrack}
                imageUrl={randomArtist?.image_artist}
                onClose={() => setHintBestTrack(false)}
            />
        </div>
    );
};

export default ArtistMode;
