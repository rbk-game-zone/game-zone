import React, { createContext, useContext, useState } from 'react';

const GameContext = createContext(null);

export const GameProvider = ({ children }) => {
    const [gameId, setGameId] = useState(null);
    const [userId, setUserId] = useState(null);

    return (
        <GameContext.Provider value={{ gameId, setGameId, userId, setUserId }}>
            {children}
        </GameContext.Provider>
    );
};

export const useGameContext = () => useContext(GameContext); 