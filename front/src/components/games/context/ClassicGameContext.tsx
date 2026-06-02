import React, { createContext, useState, ReactNode } from "react";

type GameContextType = {
  messagesClassic: any[];
  setMessagesClassic: React.Dispatch<React.SetStateAction<any[]>>;

  attemptsClassic: number;
  setAttemptsClassic: React.Dispatch<React.SetStateAction<number>>;

  solutionTrack: any;
  setSolutionTrackClassic: React.Dispatch<React.SetStateAction<any>>;
};

export const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [messagesClassic, setMessagesClassic] = useState<any[]>([]);
  const [attemptsClassic, setAttemptsClassic] = useState<number>(0);
  const [solutionTrack, setSolutionTrackClassic] = useState<any>(null);

  return (
    <GameContext.Provider
      value={{
        messagesClassic,
        setMessagesClassic,
        attemptsClassic,
        setAttemptsClassic,
        solutionTrack,
        setSolutionTrackClassic,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};