import React, { useEffect, useState } from 'react';
import './adey.css'; // Optional: If you have additional CSS

const rain = ['🌼', '🌼', '*'];

const Rainfall = () => {
    const [raindrops, setRaindrops] = useState([]);

    useEffect(() => {
        const createRain = () => {
            const duration = Math.random() * 5 + 5;
            const newRaindrop = {
                id: Date.now() + Math.random(), // Unique key for each raindrop
                text: rain[Math.floor(Math.random() * rain.length)],
                fontSize: `${Math.random() * 2 + 1}em`,
                left: `${Math.random() * 100}vw`,
                animationDuration: `${duration}s`,
            };
            setRaindrops((prevRaindrops) => [...prevRaindrops, newRaindrop]);

            setTimeout(() => {
                setRaindrops((prevRaindrops) =>
                    prevRaindrops.filter((drop) => drop.id !== newRaindrop.id)
                );
            }, duration * 1000);
        };

        const intervalId = setInterval(createRain, 300);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="rainfall-container">
            {raindrops.map((drop) => (
                <div
                    key={drop.id}
                    className="rain"
                    style={{
                        fontSize: drop.fontSize,
                        left: drop.left,
                        animationDuration: drop.animationDuration,
                    }}
                >
                    {drop.text}
                </div>
            ))}
        </div>
    );
};

export default Rainfall;
