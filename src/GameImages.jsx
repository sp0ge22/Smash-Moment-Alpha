import React, { useEffect, useState } from 'react';
import gameData from './assets/Answer'; // Adjust the path as per your file structure

const GameImages = ({ isBothPlayerAnswersCorrect, GlobalTournamentAnswer }) => {
    const initialImagePaths = gameData[0].imagePaths;
    const alternateGifPaths = [
        '/assets/GameImages/hbox-popoff-1.gif', // Replace with the correct path
        '/assets/GameImages/hbox-popoff-2.gif',
        '/assets/GameImages/hbox-popoff-3.gif'
    ];
    
    const borderImagePath = '/assets/GameImages/Center_CRT.png';
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const [gifPaths, setGifPaths] = useState(gameData[0].gifPaths);

    // Update GIF paths based on conditions
    useEffect(() => {
        if (isBothPlayerAnswersCorrect || GlobalTournamentAnswer) {
            setGifPaths(alternateGifPaths);
        } else {
            setGifPaths(gameData[0].gifPaths);
        }
    }, [isBothPlayerAnswersCorrect, GlobalTournamentAnswer, gameData]);

    // Preload GIFs
    useEffect(() => {
        gifPaths.forEach(gifPath => {
            const img = new Image();
            img.src = gifPath;
        });
    }, [gifPaths]);

    const handleImageHover = (index) => {
        setHoveredIndex(index);
    };

    return (
        <div className="flex flex-col items-center">
            <div className="flex justify-center">
                {initialImagePaths.map((path, index) => (
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
                            {hoveredIndex === index && (
                                <img
                                    className='px-1 pb-12'
                                    src={gifPaths[index]}
                                    alt={`GIF ${index + 1}`}
                                    style={{
                                        position: 'absolute',
                                        maxWidth: '90%', 
                                        maxHeight: '90%', 
                                        objectFit: 'contain',
                                        pointerEvents: 'none',
                                    }}
                                />
                            )}
                        </div>
                        <img
                            src={borderImagePath}
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
