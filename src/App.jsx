import React, { useState } from 'react';
import './App.css';
import GameImages from './GameImages';
import PlayerGuess from './PlayerGuess';
import TournamentGuess from './TournamentGuess';
import Congrats from './Congrats';

export default function App() {
  const logoSrc = '/assets/GameImages/AMIM-Header.gif';
  const backgroundSrc = '/assets/GameImages/background2.gif';
  const discordSrc = '/assets/GameImages/discord.png';
  const [isBothPlayerAnswersCorrect, setIsBothPlayerAnswersCorrect] = useState(null);
  const [GlobalTournamentAnswer, setGlobalTournamentAnswer] = useState(null);

  return (
        <div className="relative h-screen mx-auto" style={{ backgroundImage: `url(${backgroundSrc})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'bottom' }}>
          {/* Discord Logo */}
          <a href="https://discord.gg/c3taXNgV">
            <img src={discordSrc} alt="Discord Logo" className="absolute top-0 left-0 m-10" style={{ width: '50px' }} />
          </a>
          {/* Rest of the content */}
          <div className="flex flex-col items-center justify-center pb-10 h-full">
            <header>
              <img src={logoSrc} alt="Melee Logo" className="mx-auto" style={{ width: '50%' }} />
            </header>

          <div className="flex flex-col items-center justify-start"> {/* Add 'justify-start' class */}
            <div className="flex flex-col">
              <GameImages
                isBothPlayerAnswersCorrect={isBothPlayerAnswersCorrect}
                GlobalTournamentAnswer={GlobalTournamentAnswer}
              />
            </div>

            <div className='bg-black bg-opacity-50 rounded-2xl shadow-lg px-5 mt-5 mb-5'>
              <div className="mt-5 text-center">
                <h1 className="text-white text-2xl font-bold shadow-md">Which two players had this interaction?</h1>
              </div>

              <div className=''>
                <PlayerGuess setIsBothPlayerAnswersCorrect={setIsBothPlayerAnswersCorrect} />
              </div>

              <div className="mt-5 text-center">
                <h1 className="text-white text-2xl font-bold shadow-lg">Which tournament was this interaction?</h1>
              </div>

              <div className='pb-10'>
                <TournamentGuess setGlobalTournamentAnswer={setGlobalTournamentAnswer} />
              </div>
            </div>
          </div>

          {/* Reserve space for the Congrats component */}
          <div className="flex justify-center w-full" style={{ minHeight: '50px' }}>
            {isBothPlayerAnswersCorrect && GlobalTournamentAnswer && (
              <div className='font-custom text-white flex flex-col items-center justify-center'>
                <Congrats 
                  isBothPlayerAnswersCorrect={isBothPlayerAnswersCorrect}
                  GlobalTournamentAnswer={GlobalTournamentAnswer}/>
              </div>
            )}
          </div>
          </div> {/* Add closing tag for the outer div */}
        </div>
      );
    }
