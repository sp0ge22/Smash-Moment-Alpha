import React, { useState, useEffect, useRef } from 'react';
import Tournaments from './assets/Tournaments';
import gameData from './assets/Answer';

const Tournament = ({ setGlobalTournamentAnswer, currentIndex }) => {
    const [tournamentInput, setTournamentInput] = useState('');
    const [selectedTournament, setSelectedTournament] = useState('');
    const [isTournamentAnswerCorrect, setIsTournamentAnswerCorrect] = useState(null);
    const [animationKey, setAnimationKey] = useState(0);
    const [showTournamentList, setShowTournamentList] = useState(false);
    const [wrongGuessCount, setWrongGuessCount] = useState(0); // Counter for wrong guesses
    const inputRef = useRef(null);
    const { tournamentAnswer } = gameData[currentIndex];
    const [isHovering, setIsHovering] = useState(false);
    const listRef = useRef(null);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target) &&
            listRef.current && !listRef.current.contains(event.target)) {
            setShowTournamentList(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (isTournamentAnswerCorrect === false) {
            const wrongAudio = new Audio('/assets/GameSounds/fox-ahh.wav');
            wrongAudio.volume = 0.1; // Set volume to half
            wrongAudio.play();
        }
    }, [isTournamentAnswerCorrect, wrongGuessCount]); // Add wrongGuessCount as a dependency

    const handleTournamentInputChange = (event) => {
        if (!isTournamentAnswerCorrect) {
            setTournamentInput(event.target.value);
            setShowTournamentList(event.target.value.length > 0); // Show list only if input is not empty
            setSelectedTournament(''); // Clear the selected tournament when the user types
        }
    };

    const selectTournament = (tournament) => {
        setSelectedTournament(tournament);
        setTournamentInput(tournament);
        setShowTournamentList(false);
    };

    const submitTournamentGuess = async () => {
        const answer = selectedTournament || tournamentInput; // Use selectedTournament if it's set, otherwise use tournamentInput
    
        if (tournamentAnswer.toLowerCase() === answer.toLowerCase()) { // Compare answers in lowercase
            if (!isTournamentAnswerCorrect) {
                const audio = new Audio('/assets/GameSounds/fox-shine.wav');
                audio.volume = 0.1; // Set volume to 0.1
                audio.play();
                await new Promise(resolve => setTimeout(resolve, 200)); // Wait 200 milliseconds
                audio.volume = 0.1; // Set volume to 0.1
                audio.play();
            }
            setIsTournamentAnswerCorrect(true);
            setGlobalTournamentAnswer(true); // Set GlobalTournamentAnswer to true
            console.log(`Correct! The answer was: ${answer}`);
        } else {
            setAnimationKey(prevKey => prevKey + 1);
            setIsTournamentAnswerCorrect(false);
            setGlobalTournamentAnswer(false); // Set GlobalTournamentAnswer to false
            setWrongGuessCount(prevCount => prevCount + 1);
        }
    };
    

    const filteredTournaments = tournamentInput
        ? Tournaments.filter(tournament =>
            tournament.toLowerCase().includes(tournamentInput.toLowerCase())
          ).slice(0, 3)
        : [];

        return (
            <div className="mt-4 flex justify-center w-full">
                <div className="flex space-x-2 items-center w-full">
                    <div className="relative flex-grow">
                        <input
                            key={animationKey} // Use key to force re-render
                            type="text"
                            value={tournamentInput}
                            onChange={handleTournamentInputChange}
                            placeholder="Type to filter tournaments"
                            className={`text-black rounded p-2 ${isTournamentAnswerCorrect ? 'bg-green-200' : 'bg-white'} w-full ${isTournamentAnswerCorrect === false ? 'animate-buzz' : ''}`}
                            readOnly={isTournamentAnswerCorrect}
                            ref={inputRef}
                        />

                        {showTournamentList && tournamentInput && filteredTournaments.length > 0 && (
                            <div 
                                className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-md overflow-auto z-10" 
                                style={{ maxHeight: '200px', width: '450px' }}
                                onMouseEnter={() => setIsHovering(true)}
                                onMouseLeave={() => setIsHovering(false)}
                                ref={listRef} // Attach the listRef here
                            >
                                {filteredTournaments.map((tournament, index) => (
                                    <div
                                        key={index}
                                        onClick={() => selectTournament(tournament)}
                                        className="p-2 hover:bg-gray-100 cursor-pointer"
                                    >
                                        {tournament}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
        
                    <button onClick={submitTournamentGuess} className="bg-white p-2 rounded flex items-center space-x-1 font-custom">
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

export default Tournament;
