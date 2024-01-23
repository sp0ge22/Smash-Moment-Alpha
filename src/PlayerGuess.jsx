import React, { useState, useEffect, useRef } from 'react';
import Players from './assets/Players';
import gameData from './assets/Answer';

const PlayerGuess = ({ setIsBothPlayerAnswersCorrect }) => {
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
    const { playerAnswers } = gameData[0];
    const [wrongAttemptOne, setWrongAttemptOne] = useState(0);
    const [wrongAttemptTwo, setWrongAttemptTwo] = useState(0);
    const playerListOneRef = useRef(null);
    const playerListTwoRef = useRef(null);

    const updateDatabase = async () => {
        try {
          const response = await fetch('http://localhost:3001/incrementCount', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              // Include any necessary data here
            }),
          });
          const data = await response.json();
          console.log('Response from server:', data);
        } catch (error) {
          console.error('Error making the update request:', error);
        }
      };
    
    useEffect(() => {
        if (isPlayerAnswerOneCorrect && isPlayerAnswerTwoCorrect) {
            // Call the function to update the database
            updateDatabase();
        }
        // You can add other conditions or states as dependencies if needed
    }, [isPlayerAnswerOneCorrect, isPlayerAnswerTwoCorrect]);

    const incrementCorrectAnswers = async () => {
        console.log('incrementCorrectAnswers called');
        try {
            const response = await fetch('http://localhost:3001/incrementCount', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const data = await response.json();
          console.log('Updated correct answers count:', data);
        } catch (error) {
          console.error('Error:', error);
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
        let answerOneCorrect = false, answerTwoCorrect = false;
        const lowerCasePlayerAnswers = playerAnswers.map(answer => answer.toLowerCase());
      
        // Check first answer (either typed or selected)
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
      
        // Check second answer (either typed or selected)
        const finalAnswerTwo = selectedPlayerAnswerTwo.toLowerCase() || playerInputTwo.toLowerCase();
        if (lowerCasePlayerAnswers.includes(finalAnswerTwo)) {
          setIsPlayerAnswerTwoCorrect(true);
          answerTwoCorrect = true;
        } else {
          setAnimationKeyTwo(prevKey => prevKey + 1);
          setIsPlayerAnswerTwoCorrect(false);
          setWrongAttemptTwo(prev => prev + 1);
        }
      
        // Update the isBothPlayerAnswersCorrect state using the prop from App
        setIsBothPlayerAnswersCorrect(answerOneCorrect && answerTwoCorrect);
      
        // Check if both answers are correct and then update the database
        if (answerOneCorrect && answerTwoCorrect) {
          await incrementCorrectAnswers(); // Update the database
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
                        placeholder="Type to filter answers"
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
                        placeholder="Type your guess"
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