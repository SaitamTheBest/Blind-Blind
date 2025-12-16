import React, { createContext, useState, useEffect, ReactNode } from "react";

type ArtistGameContextType = {
    messagesArtist: any[];
    setMessagesArtist: (messagesArtist: any[]) => void;
    attemptsArtist: number;
    setAttemptsArtist: (attemptsArtist: number) => void;
    randomArtist: any;
    setRandomArtist: (track: any) => void;
};

export const ArtistGameContext = createContext<ArtistGameContextType | undefined>(undefined);

export const ArtistGameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messagesArtist, setMessagesArtist] = useState<any[]>([]);
    const [attemptsArtist, setAttemptsArtist] = useState<number>(0);
    const [randomArtist, setRandomArtist] = useState<any>(null);

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        const savedAttempts = localStorage.getItem("attempts");
        const savedRandomArtist = localStorage.getItem("randomArtist");
        const savedDate = localStorage.getItem("trackDate");

        const today = getTodayDate();

        if (savedRandomArtist && savedDate === today) {
            setRandomArtist(JSON.parse(savedRandomArtist));
            if (savedMessages) {
                setMessagesArtist(JSON.parse(savedMessages));
            }
            if (savedAttempts) {
                setAttemptsArtist(parseInt(savedAttempts, 10));
            }
        } else {
            localStorage.removeItem("messages");
            localStorage.removeItem("attempts");
            localStorage.removeItem("randomTrack");
            localStorage.removeItem("trackDate");
            localStorage.removeItem("previousGuesses");
            setMessagesArtist([]);
            setAttemptsArtist(0);
            setRandomArtist(null);
        }
    }, []);

    useEffect(() => {
        if (randomArtist) {
            localStorage.setItem("randomArtist", JSON.stringify(randomArtist));
            localStorage.setItem("trackDate", getTodayDate());
        }

        localStorage.setItem("messages", JSON.stringify(messagesArtist));
        localStorage.setItem("attempts", attemptsArtist.toString());
    }, [messagesArtist, attemptsArtist, randomArtist]);

    return (
        <ArtistGameContext.Provider value={{ messagesArtist, setMessagesArtist, attemptsArtist, setAttemptsArtist, randomArtist, setRandomArtist }}>
            {children}
        </ArtistGameContext.Provider>
    );
};
