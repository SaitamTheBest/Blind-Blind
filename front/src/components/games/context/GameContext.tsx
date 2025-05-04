import React, { createContext, useState, useEffect, ReactNode } from "react";

type GameContextType = {
    messages: any[];
    setMessages: (messages: any[]) => void;
    attempts: number;
    setAttempts: (attempts: number) => void;
    randomTrack: any;
    setRandomTrack: (track: any) => void;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<any[]>([]);
    const [attempts, setAttempts] = useState<number>(0);
    const [randomTrack, setRandomTrack] = useState<any>(null);

    const getTodayDate = (): string => new Date().toISOString().split('T')[0];

    useEffect(() => {
        const savedMessages = localStorage.getItem("messages");
        const savedAttempts = localStorage.getItem("attempts");
        const savedRandomTrack = localStorage.getItem("randomTrack");
        const savedDate = localStorage.getItem("trackDate");

        if (savedMessages) {
            setMessages(JSON.parse(savedMessages));
        }

        if (savedAttempts) {
            setAttempts(parseInt(savedAttempts, 10));
        }

        if (savedRandomTrack && savedDate === getTodayDate()) {
            setRandomTrack(JSON.parse(savedRandomTrack));
        } else {
            localStorage.removeItem("messages");
            localStorage.removeItem("attempts");
            localStorage.removeItem("randomTrack");
            localStorage.removeItem("trackDate");
        }
    }, []);

    useEffect(() => {
        if (randomTrack) {
            localStorage.setItem("randomTrack", JSON.stringify(randomTrack));
            localStorage.setItem("trackDate", getTodayDate());
        }

        localStorage.setItem("messages", JSON.stringify(messages));
        localStorage.setItem("attempts", attempts.toString());
    }, [messages, attempts, randomTrack]);

    return (
        <GameContext.Provider value={{ messages, setMessages, attempts, setAttempts, randomTrack, setRandomTrack }}>
            {children}
        </GameContext.Provider>
    );
};
