import React, { useEffect, useRef, useState } from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import Popup from '../components/games/classic/Popup';  // Import du popup
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

    const handleGuessSubmit = (track: any) => {
        if (gameEnded || !track || !track.name) return;

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
            setPopupOpen(true);  // Ouvre le popup
            setGameEnded(true);  // Termine le jeu
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

    return (
        <div className="classic-container">
            <div className="content">
                <h1>Devinez la chanson !</h1>
                <div>
                    <GuessInput onGuessSubmit={handleGuessSubmit} tracks={tracks} disabled={gameEnded} />
                    <h3>Propositions :</h3>
                    <AnswersTable messages={messages} randomTrack={randomTrack} />
                </div>
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
