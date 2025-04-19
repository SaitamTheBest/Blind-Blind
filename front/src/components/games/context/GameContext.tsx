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
    const [attempts, setAttempts] = useState(0);
    const [randomTrack, setRandomTrack] = useState<any>(null);

    useEffect(() => {
    }, [messages, attempts, randomTrack]);

    return (
        <GameContext.Provider value={{ messages, setMessages, attempts, setAttempts, randomTrack, setRandomTrack }}>
            {children}
        </GameContext.Provider>
    );
};
