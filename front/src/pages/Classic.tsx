import React, { useEffect, useState, useRef } from 'react';
import GuessInput from '../components/games/classic/GuessInput';
import AnswersTable from '../components/games/classic/AnswersTable';
import '../styles/games/classic/classic.css';

const ClassicMode: React.FC = () => {
    const [messages, setMessages] = useState<any[]>([]);
    const [tracks, setTracks] = useState<any[]>([]);
    const [randomTrack, setRandomTrack] = useState<any>(null);
    const isMounted = useRef(false);

    const handleGuessSubmit = (track: any) => {
        if (track && track.name) {
            const guessDetails = {
                name: track.name,
                artists: track.artists,
                album: track.album,
                popularity: track.popularity,
                release_date: track.release_date,
                isCorrect: {
                    name: track.name.toLowerCase() === randomTrack.name.toLowerCase(),
                    artists: track.artists.toLowerCase() === randomTrack.artists.toLowerCase(),
                    album: track.album.toLowerCase() === randomTrack.album.toLowerCase(),
                    popularity: track.popularity === randomTrack.popularity,
                    release_date: track.release_date === randomTrack.release_date
                }
            };
            setMessages([guessDetails, ...messages]);
            setTracks(tracks.filter(t => t.name !== track.name));
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
                    <GuessInput onGuessSubmit={handleGuessSubmit} tracks={tracks} />
                    <h3>Propositions :</h3>
                    <AnswersTable messages={messages} randomTrack={randomTrack} />
                </div>
            </div>
        </div>
    );
};

export default ClassicMode;