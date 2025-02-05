// DynamicGameLoader.js
import React, { useState, useEffect } from 'react';

const DynamicGameLoader = ({ gameName }) => {
    const [GameComponent, setGameComponent] = useState(null);

    useEffect(() => {
        import(`./games/${gameName}`).then((module) => {
            setGameComponent(() => module.default);
        }).catch(err => {
            console.error("Error loading game:", err);
        });
    }, [gameName]);

    return GameComponent ? <GameComponent /> : <div>Loading game...</div>;
};

export default DynamicGameLoader;