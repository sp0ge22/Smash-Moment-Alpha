import React, { useState, useEffect, useRef } from 'react';
import Players from './assets/Players';
import gameData from './assets/Answer';
import { database } from './firebase'; // Make sure this path is correct
import { ref, runTransaction } from 'firebase/database';

const PlayerGuess = ({ setIsBothPlayerAnswersCorrect, currentIndex }) => {
    const [playerInputOne, setPlayerInputOne] = useState('');
    const [playerInputTwo, setPlayerInputTwo] = useState('');
    const [selectedPlayerAnswerOne, setSelectedPlayerAnswerOne] = useState('');
    const [selectedPlayerAnswerTwo, setSelectedPlayerAnswerTwo] = useState('');
    const [isPlayerAnswerOneCorrect, setIsPlayerAnswerOneCorrect] = useState(null);
    const [isPlayerAnswerTwoCorrect, setIsPlayerAnswerTwoCorrect] = useState(null); 
    const [animationKeyOne, setAnimationKeyOne] = useState(0);
    const [animationKeyTwo, setAnimationKeyTwo] = useState(0);
    const [showPlayerListOne, setShowPlayerListOne] = useState(false);
    const [showPlayerListTwo, setShowPlayerListTwo] = useState(false);
    const { playerAnswers } = gameData[currentIndex]; // Use currentIndex to access the correct object
    const [wrongAttemptOne, setWrongAttemptOne] = useState(0);
    const [wrongAttemptTwo, setWrongAttemptTwo] = useState(0);
    const playerListOneRef = useRef(null);
    const playerListTwoRef = useRef(null);
    const [isSubmissionProcessed, setIsSubmissionProcessed] = useState(false);


    const incrementCorrectAnswers = async () => {
        const countRef = ref(database, 'game/correctAnswersCount'); // Adjust this path as per your database structure
    
        try {
            // Begin a transaction to read and write data atomically
            await runTransaction(countRef, (currentValue) => {
                // If it's the first time, the count might not exist, so we start from 0
                if (currentValue === null) {
                    return 1;
                } else {
                    return currentValue + 1;
                }
            });
            console.log("Correct answers count incremented successfully.");
        } catch (error) {
            console.error('Error incrementing correct answers count: ', error);
        }
    };


    useEffect(() => {
        if (isPlayerAnswerOneCorrect === true) {
            const correctAudio = new Audio('/assets/GameSounds/fox-shine.wav');
            correctAudio.play();
        } else if (isPlayerAnswerOneCorrect === false) {
            const wrongAudio = new Audio('/assets/GameSounds/fox-ahh.wav');
            wrongAudio.play();
        }
    }, [isPlayerAnswerOneCorrect, wrongAttemptOne]);

    useEffect(() => {
        if (isPlayerAnswerTwoCorrect === true) {
            const correctAudio = new Audio('/assets/GameSounds/fox-shine.wav');
            correctAudio.play();
        } else if (isPlayerAnswerTwoCorrect === false) {
            const wrongAudio = new Audio('/assets/GameSounds/fox-ahh.wav');
            wrongAudio.play();
        }
    }, [isPlayerAnswerTwoCorrect, wrongAttemptTwo]);

    const handlePlayerInputChangeOne = (event) => {
        if (!isPlayerAnswerOneCorrect) {
            setPlayerInputOne(event.target.value);
            setSelectedPlayerAnswerOne(''); // Clear the selected player answer
            setShowPlayerListOne(true);
        }
    };

    const handlePlayerInputChangeTwo = (event) => {
        if (!isPlayerAnswerTwoCorrect) {
            setPlayerInputTwo(event.target.value);
            setSelectedPlayerAnswerTwo(''); // Clear the selected player answer
            setShowPlayerListTwo(true);
        }
    };

    const selectPlayerAnswerOne = (answer) => {
        setSelectedPlayerAnswerOne(answer);
        setPlayerInputOne(answer);
        setShowPlayerListOne(false);
    };

    const selectPlayerAnswerTwo = (answer) => {
        setSelectedPlayerAnswerTwo(answer);
        setPlayerInputTwo(answer);
        setShowPlayerListTwo(false);
    };

    const submitPlayerGuess = async () => {
        if (isSubmissionProcessed) {
            // If the submission has already been processed, exit the function to prevent further processing
            console.log("Submission already processed");
            return;
        }
    
        let answerOneCorrect = false, answerTwoCorrect = false;
        const lowerCasePlayerAnswers = playerAnswers.map(answer => answer.toLowerCase());
    
        // Check first answer
        const finalAnswerOne = selectedPlayerAnswerOne.toLowerCase() || playerInputOne.toLowerCase();
        if (lowerCasePlayerAnswers.includes(finalAnswerOne)) {
            setIsPlayerAnswerOneCorrect(true);
            answerOneCorrect = true;
        } else {
            setAnimationKeyOne(prevKey => prevKey + 1);
            setIsPlayerAnswerOneCorrect(false);
            setWrongAttemptOne(prev => prev + 1);
        }
    
        // Wait for the first sound to play and 0.5 second delay
        await new Promise(resolve => setTimeout(resolve, 500));
    
        // Check second answer
        const finalAnswerTwo = selectedPlayerAnswerTwo.toLowerCase() || playerInputTwo.toLowerCase();
        if (lowerCasePlayerAnswers.includes(finalAnswerTwo)) {
            setIsPlayerAnswerTwoCorrect(true);
            answerTwoCorrect = true;
        } else {
            setAnimationKeyTwo(prevKey => prevKey + 1);
            setIsPlayerAnswerTwoCorrect(false);
            setWrongAttemptTwo(prev => prev + 1);
        }
    
        // Update the isBothPlayerAnswersCorrect state
        setIsBothPlayerAnswersCorrect(answerOneCorrect && answerTwoCorrect);
    
        // Check if both answers are correct, then update the database
        if (answerOneCorrect && answerTwoCorrect) {
            await incrementCorrectAnswers(); // Call this function to update the database
            setIsSubmissionProcessed(true); // Set the flag to true as the submission is processed
        }
    };
    
    const filteredPlayersOne = playerInputOne
        ? Players.filter(player =>
            player.toLowerCase().includes(playerInputOne.toLowerCase())
          ).slice(0, 3)
        : [];

    const filteredPlayersTwo = playerInputTwo
        ? Players.filter(player =>
            player.toLowerCase().includes(playerInputTwo.toLowerCase())
          ).slice(0, 3)
        : [];

    const handleClickOutsideOne = (event) => {
        if (playerListOneRef.current && !playerListOneRef.current.contains(event.target)) {
            setShowPlayerListOne(false);
        }
    };

    const handleClickOutsideTwo = (event) => {
        if (playerListTwoRef.current && !playerListTwoRef.current.contains(event.target)) {
            setShowPlayerListTwo(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideOne);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideOne);
        };
    }, []);

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutsideTwo);
        return () => {
            document.removeEventListener('mousedown', handleClickOutsideTwo);
        };
    }, []);

    return (
        <div className="mt-4 flex justify-center">
            <div className="flex space-x-2 items-center">
                <div className="relative" ref={playerListOneRef}>
                    <input
                        key={animationKeyOne}
                        type="text"
                        value={playerInputOne}
                        onChange={handlePlayerInputChangeOne}
                        placeholder="Type to search for players"
                        className={`text-black rounded p-2 ${isPlayerAnswerOneCorrect ? 'bg-green-200' : 'bg-white'} ${isPlayerAnswerOneCorrect === false ? 'animate-buzz' : ''}`}
                        readOnly={isPlayerAnswerOneCorrect}
                    />
                    {showPlayerListOne && playerInputOne && filteredPlayersOne.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md overflow-auto z-10" style={{ maxHeight: '200px', width: '198px' }}>
                            {filteredPlayersOne.map((player, index) => (
                                <div
                                    key={index}
                                    onClick={() => selectPlayerAnswerOne(player)}
                                    className="p-2 hover:bg-gray-200 cursor-pointer"
                                >
                                    {player}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <img
                    src="/assets/GameImages/vs-logo.png"
                    alt="VS"
                    className="w-10 h-10"
                />

                <div className="relative" ref={playerListTwoRef}>
                    <input
                        key={animationKeyTwo}
                        type="text"
                        value={playerInputTwo}
                        onChange={handlePlayerInputChangeTwo}
                        placeholder="Type to search for players"
                        className={`text-black rounded p-2 ${isPlayerAnswerTwoCorrect ? 'bg-green-200' : 'bg-white'} ${isPlayerAnswerTwoCorrect === false ? 'animate-buzz' : ''}`}
                        readOnly={isPlayerAnswerTwoCorrect}
                    />
                    {showPlayerListTwo && playerInputTwo && filteredPlayersTwo.length > 0 && (
                        <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md overflow-auto z-10" style={{ maxHeight: '200px', width: '198px' }}>
                            {filteredPlayersTwo.map((player, index) => (
                                <div
                                    key={index}
                                    onClick={() => selectPlayerAnswerTwo(player)}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                >
                                    {player}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <button onClick={submitPlayerGuess} className="bg-white p-2 rounded flex items-center space-x-1 font-custom">
                    <img
                        src="/assets/GameImages/Smash_Bal.png"
                        alt="Melee Logo"
                        className="w-4 h-4"
                    />
                    <span>Submit</span>
                </button>
            </div>
        </div>
    );
};

export default PlayerGuess;