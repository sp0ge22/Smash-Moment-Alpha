import React, { useEffect, useState } from 'react';
import gameData from './assets/Answer'; // Adjust the path as per your file structure

const GameImages = ({ isBothPlayerAnswersCorrect, GlobalTournamentAnswer, gifPaths, currentIndex }) => {
    const alternateGifPaths = [
        '/assets/GameImages/hbox-popoff-1.gif',
        '/assets/GameImages/hbox-popoff-2.gif',
        '/assets/GameImages/hbox-popoff-3.gif'
    ];

    const borderImagePath = {
        0: '/assets/GameImages/Left_CRT.png',
        1: '/assets/GameImages/Center_CRT.png',
        2: '/assets/GameImages/Right_CRT.png'
    };

    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [localGifPaths, setLocalGifPaths] = useState(gifPaths); // Local state for gif paths

    // Update local GIF paths based on conditions
    useEffect(() => {
        if (isBothPlayerAnswersCorrect && GlobalTournamentAnswer) {
            setLocalGifPaths(alternateGifPaths);
        } else {
            setLocalGifPaths(gameData[currentIndex].gifPaths);
        }
    }, [isBothPlayerAnswersCorrect, GlobalTournamentAnswer, currentIndex, gifPaths]);

    // Preload GIFs
    useEffect(() => {
        localGifPaths.forEach(gifPath => {
            const img = new Image();
            img.src = gifPath;
        });
    }, [localGifPaths]);

    const handleImageHover = (index) => {
        setHoveredIndex(index);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center">
                {gameData[currentIndex].imagePaths.map((path, index) => (
                    <div
                        key={index}
                        className="image-with-border"
                        style={{ 
                            position: 'relative', 
                            width: '420px', 
                            height: '400px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                        }}
                        onMouseEnter={() => handleImageHover(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                    >
                        <div
                            style={{
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                width: '100%',
                                height: '100%',
                                boxSizing: 'border-box',
                            }}
                        >
                            <img
                                className='px-1 pb-12'
                                src={path}
                                alt={`Image ${index + 1}`}
                                style={{ 
                                    maxWidth: '90%', 
                                    maxHeight: '90%', 
                                    objectFit: 'contain'
                                }}
                            />
                            {(hoveredIndex === index || (isBothPlayerAnswersCorrect && GlobalTournamentAnswer)) && (
                                <img
                                    className='px-1 pb-12'
                                    src={localGifPaths[index]}
                                    alt={`GIF ${index + 1}`}
                                    style={{
                                        position: 'absolute',
                                        maxWidth: '90%', 
                                        maxHeight: '100%', 
                                        objectFit: 'contain',
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}
                        </div>
                        <img
                            src={borderImagePath[index]}
                            alt="Border"
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                                pointerEvents: 'none',
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GameImages;
