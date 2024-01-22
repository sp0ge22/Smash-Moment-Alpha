import React, { useState, useEffect } from 'react';
import './App.css';

const Congrats = ({ isBothPlayerAnswersCorrect, GlobalTournamentAnswer }) => {
    const [showText, setShowText] = useState(true);
    const [startAnimation, setStartAnimation] = useState(false);

    useEffect(() => {
        if (isBothPlayerAnswersCorrect && GlobalTournamentAnswer) {
            setStartAnimation(true);
            const interval = setInterval(() => {
                setShowText(prev => !prev); // Toggle the state
            }, 3500); // Total of 1.5s fade out, 3s display, and 1.5s fade in

            return () => clearInterval(interval); // Clean up the interval
        }
    }, [isBothPlayerAnswersCorrect, GlobalTournamentAnswer]);

    const renderImages = () => {
        const images = [];
        for (let i = 0; i < 16; i++) {
            if (i === 8) {
                images.push(
                    <div
                        key={`text-${i}`}
                        className="w-[600px] flex items-center justify-center" // Fixed height container
                    >
                        <p className="text-center text-5xl">
                            {showText ? "You've Juan!" : "New Moments Daily"}
                        </p>
                    </div>
                );
            }
            images.push(
                <img
                    key={i}
                    src="/assets/GameImages/fox-waveshine.gif"
                    alt="fox-wave"
                    className="w-20 h-20"
                />
            );
        }
        return images;
    };

    return (
        <div className="h-12">
            <div className="flex">
                {renderImages()}
            </div>
        </div>
    );
};

export default Congrats;
