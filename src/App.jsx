import React, { useState } from 'react';
import AffirmationScene from './components/AffirmationScene';

const affirmations = [
  "You are enough",
  "You are capable of amazing things",
  "Your potential is limitless",
  "You bring light to others",
  "You are worthy of love"
];

function App() {
  const [currentAffirmationIndex, setCurrentAffirmationIndex] = useState(-1); // Start with no affirmation shown
  const [isRevealed, setIsRevealed] = useState(false);

  const handleClick = () => {
    if (!isRevealed) {
      // First click reveals the first affirmation
      setCurrentAffirmationIndex(0);
      setIsRevealed(true);
    } else {
      // Subsequent clicks cycle through affirmations
      setCurrentAffirmationIndex((prev) => (prev + 1) % affirmations.length);
    }
  };

  return (
    <div className="w-screen h-screen relative overflow-hidden bg-gray-900">
      <AffirmationScene />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white p-8 rounded-lg bg-black/50 max-w-2xl">
          {currentAffirmationIndex >= 0 ? (
            <h1 className="text-4xl md:text-5xl font-bold animate-fade-in">
              {affirmations[currentAffirmationIndex]}
            </h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold">
              Click to reveal your affirmation
            </h1>
          )}
          <button 
            className="mt-6 px-6 py-2 bg-indigo-600 rounded-full hover:bg-indigo-700 transition-colors"
            onClick={handleClick}
          >
            {isRevealed ? "Next Affirmation" : "Reveal Affirmation"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;