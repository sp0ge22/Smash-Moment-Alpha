import React, { useState, useEffect } from 'react';
import './App.css';
import { ref, onValue } from 'firebase/database';
import { database } from './firebase'; // Assuming this is the correct path to your Firebase configuration


const Congrats = ({ isBothPlayerAnswersCorrect, GlobalTournamentAnswer }) => {
    const [showText, setShowText] = useState(1); // Changed to number, 1 for first message, 2 for second, 3 for third
    const [startAnimation, setStartAnimation] = useState(false);
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0);

    useEffect(() => {
        if (isBothPlayerAnswersCorrect && GlobalTournamentAnswer) {
            setStartAnimation(true);
            const interval = setInterval(() => {
                setShowText(prev => (prev % 3) + 1); // Cycle through 1, 2, 3
            }, 3500);
    
            const countRef = ref(database, 'game/correctAnswersCount'); // Adjust this path as per your database structure
            const unsubscribe = onValue(countRef, (snapshot) => {
                const data = snapshot.val();
                if (data !== null) {
                    setCorrectAnswersCount(data);
                } else {
                    console.log("No correct answers count found!");
                }
            }, (error) => {
                console.error('Error fetching correct answers count:', error);
            });
    
            return () => {
                clearInterval(interval);
                unsubscribe(); // Unsubscribe from Firebase updates when component unmounts
            };
        }
    }, [isBothPlayerAnswersCorrect, GlobalTournamentAnswer]);
    

    const getMessage = () => {
        switch (showText) {
            case 1:
                return "You've Juan";
            case 2:
                return `${correctAnswersCount} people have Juan today!`;
            case 3:
                return "New Moments (Coming Soon)";
            default:
                return "";
        }
    };

    const renderImages = () => {
        const images = [];
        for (let i = 0; i < 10; i++) {
            if (i === 5) {
                images.push(
                    <div key={`text-${i}`} className="w-[600px] flex items-center justify-center">
                        <p className="text-center text-5xl">
                            {getMessage()}
                        </p>
                    </div>
                );
            }
            const isInverse = i >= 5;
            images.push(
                <img
                    key={i}
                    src="/assets/GameImages/fox-laser.gif"
                    alt="fox-wave"
                    className={`w-20 h-20 ${isInverse ? 'transform scale-x-[-1]' : ''}`}
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