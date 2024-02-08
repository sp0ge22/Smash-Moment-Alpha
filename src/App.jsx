import React, { useState } from 'react';
import './App.css';
import GameImages from './GameImages';
import PlayerGuess from './PlayerGuess';
import TournamentGuess from './TournamentGuess';
import Congrats from './Congrats';
import gameData from './assets/Answer'; // Adjust the path as per your file structure


export default function App() {
  const logoSrc = '/assets/GameImages/AMIM-Header.gif';
  const backgroundSrc = '/assets/GameImages/background2.gif';
  const discordSrc = '/assets/GameImages/discord.png';
  const buttonSrc = '/assets/GameImages/Load-New-Moment.png';
  const button1Src = '/assets/GameImages/Load-New-Moment.gif';
  const [isBothPlayerAnswersCorrect, setIsBothPlayerAnswersCorrect] = useState(null);
  const [GlobalTournamentAnswer, setGlobalTournamentAnswer] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(Math.floor(Math.random() * gameData.length));
  const [gifPaths, setGifPaths] = useState(gameData[currentIndex].gifPaths);
  const [playerGuessKey, setPlayerGuessKey] = useState(0); // New key state for PlayerGuess component
  const [tournamentGuessKey, setTournamentGuessKey] = useState(0); // Key for TournamentGuess
  const [isHovered, setIsHovered] = useState(false);

  function resetPlayerGuess() {
    setPlayerGuessKey(prevKey => prevKey + 1); // Increment key to force remount of PlayerGuess
  }

  function resetTournamentGuess() {
    setTournamentGuessKey(prevKey => prevKey + 1);
  }
  
  return (
    <div
      className="relative h-screen mx-auto flex items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundSrc})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'bottom'
      }}
    >
      {/* Main Content */}
      <div className="flex flex-col items-center justify-center pb-10 pt-5 h-full">
        <header>
          <img
            src={logoSrc}
            alt="Melee Logo"
            className="mx-auto"
            style={{ width: '50%' }}
          />
        </header>
  
        <div className="flex flex-col items-center justify-start">
          <div className="flex flex-col">
            <GameImages
              isBothPlayerAnswersCorrect={isBothPlayerAnswersCorrect}
              GlobalTournamentAnswer={GlobalTournamentAnswer}
              currentIndex={currentIndex}
              gifPaths={gifPaths}
            />
          </div>
  
          {/* Main Guessing Field with Discord Icon and New Index Button */}
          <div className="flex flex-row items-center justify-center">
            {/* Discord Logo */}
            <a href="https://discord.gg/c3taXNgV" className="flex items-center justify-center">
              <img
                src={discordSrc}
                alt="Discord Logo"
                style={{ width: '100px' }}
              />
            </a>
  
            {/* Guessing Field */}
            <div className='bg-black bg-opacity-50 rounded-2xl shadow-lg px-5 mx-20 mt-0 mb-5'>
              {/* Player Interaction Question */}
              <div className="mt-5 text-center">
                <h1 className="text-white text-2xl font-bold shadow-md">
                  Which two players had this moment?
                </h1>
              </div>
  
              <div>
                <PlayerGuess
                  key={playerGuessKey}
                  setIsBothPlayerAnswersCorrect={setIsBothPlayerAnswersCorrect}
                  currentIndex={currentIndex}
                  gifPaths={gifPaths}
                />
              </div>
  
              {/* Tournament Question */}
              <div className="mt-5 text-center">
                <h1 className="text-white text-2xl font-bold shadow-lg">
                  At which tournament series was this moment?
                </h1>
              </div>
  
              <div className='pb-10'>
                <TournamentGuess
                  key={tournamentGuessKey}
                  setGlobalTournamentAnswer={setGlobalTournamentAnswer}
                  currentIndex={currentIndex}
                  gifPaths={gifPaths}
                />
              </div>
            </div>
  
            {/* New Index Button */}
            <a
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onClick={() => {
                const newIndex = currentIndex + 1;
                setCurrentIndex(newIndex >= gameData.length ? 0 : newIndex);
                resetPlayerGuess();
                resetTournamentGuess();
                setIsBothPlayerAnswersCorrect(null);
                setGlobalTournamentAnswer(null);
              }}
            >
              <img
                src={isHovered ? button1Src : buttonSrc}
                alt="Load New Moment"
                className="cursor-pointer"
                style={{ width: '200px' }}
            />
            </a>
          </div>
        </div>
  
        {/* Congrats Component */}
        <div className="flex justify-center w-full" style={{ minHeight: '50px' }}>
          {isBothPlayerAnswersCorrect && GlobalTournamentAnswer && (
            <div className='font-custom text-white flex flex-col items-center justify-center'>
              <Congrats
                isBothPlayerAnswersCorrect={isBothPlayerAnswersCorrect}
                GlobalTournamentAnswer={GlobalTournamentAnswer}
                currentIndex={currentIndex}
                gifPaths={gifPaths}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );}

