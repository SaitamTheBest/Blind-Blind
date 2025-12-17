import React, { createContext, useState, useEffect, ReactNode } from "react";

type GameContextType = {
    messagesClassic: any[];
    setMessagesClassic: (messages: any[]) => void;
    attemptsClassic: number;
    setAttemptsClassic: (attempts: number) => void;
    randomTrackClassic: any;
    setRandomTrackClassic: (track: any) => void;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messagesClassic, setMessagesClassic] = useState<any[]>([]);
    const [attemptsClassic, setAttemptsClassic] = useState<number>(0);
    const [randomTrackClassic, setRandomTrackClassic] = useState<any>(null);

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const savedMessagesClassic = localStorage.getItem("messagesClassic");
        const savedAttemptsClassic = localStorage.getItem("attemptsClassic");
        const savedRandomTrackClassic = localStorage.getItem("randomTrackClassic");
        const savedDateClassic = localStorage.getItem("trackDateClassic");

        const today = getTodayDate();

        if (savedRandomTrackClassic && savedDateClassic === today) {
            setRandomTrackClassic(JSON.parse(savedRandomTrackClassic));
            if (savedMessagesClassic) {
                setMessagesClassic(JSON.parse(savedMessagesClassic));
            }
            if (savedAttemptsClassic) {
                setAttemptsClassic(parseInt(savedAttemptsClassic, 10));
            }
        } else {
            localStorage.removeItem("messagesClassic");
            localStorage.removeItem("attemptsClassic");
            localStorage.removeItem("randomTrackClassic");
            localStorage.removeItem("trackDateClassic");
            localStorage.removeItem("previousGuessesClassic");
            setMessagesClassic([]);
            setAttemptsClassic(0);
            setRandomTrackClassic(null);
        }
    }, []);

    useEffect(() => {
        if (randomTrackClassic) {
            localStorage.setItem("randomTrackClassic", JSON.stringify(randomTrackClassic));
            localStorage.setItem("trackDateClassic", getTodayDate());
        }

        localStorage.setItem("messagesClassic", JSON.stringify(messagesClassic));
        localStorage.setItem("attemptsClassic", attemptsClassic.toString());
    }, [messagesClassic, attemptsClassic, randomTrackClassic]);

    return (
        <GameContext.Provider value={{ messagesClassic, setMessagesClassic, attemptsClassic, setAttemptsClassic, randomTrackClassic, setRandomTrackClassic }}>
            {children}
        </GameContext.Provider>
    );
};
