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
        const savedMessagesArtist = localStorage.getItem("messagesArtist");
        const savedAttemptsArtist = localStorage.getItem("attemptsArtist");
        const savedRandomArtist = localStorage.getItem("randomArtist");
        const savedDateArtist = localStorage.getItem("artistDate");

        const today = getTodayDate();

        if (savedRandomArtist && savedDateArtist === today) {
            setRandomArtist(JSON.parse(savedRandomArtist));
            if (savedMessagesArtist) {
                setMessagesArtist(JSON.parse(savedMessagesArtist));
            }
            if (savedAttemptsArtist) {
                setAttemptsArtist(parseInt(savedAttemptsArtist, 10));
            }
        } else {
            localStorage.removeItem("messagesArtist");
            localStorage.removeItem("attemptsArtist");
            localStorage.removeItem("randomArtist");
            localStorage.removeItem("artistDate");
            localStorage.removeItem("previousGuessesArtist");
            setMessagesArtist([]);
            setAttemptsArtist(0);
            setRandomArtist(null);
        }
    }, []);

    useEffect(() => {
        if (randomArtist) {
            localStorage.setItem("randomArtist", JSON.stringify(randomArtist));
            localStorage.setItem("artistDate", getTodayDate());
        }

        localStorage.setItem("messagesArtist", JSON.stringify(messagesArtist));
        localStorage.setItem("attemptsArtist", attemptsArtist.toString());
    }, [messagesArtist, attemptsArtist, randomArtist]);

    return (
        <ArtistGameContext.Provider value={{ messagesArtist, setMessagesArtist, attemptsArtist, setAttemptsArtist, randomArtist, setRandomArtist }}>
            {children}
        </ArtistGameContext.Provider>
    );
};
