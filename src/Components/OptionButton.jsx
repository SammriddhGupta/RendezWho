import { useState } from 'react';

export default function OptionButton({ option, votes = 0, onVote }) {
  const [ isClicked, setIsClicked ] = useState(false);

  const handleClick = () => {
    setIsClicked(!isClicked);
    if (!isClicked && onVote) {
      onVote();
    }
  };

  return (
    <button
      className={`flex items-center justify-center h-4 text-lg text-purple-500 font-semibold border-2 rounded-lg w-full p-3 py-5 ${isClicked ? "bg-purple-400 text-white border-purple-200" : "bg-purple-200 border-purple-400"}`}
      onClick={handleClick}
    >
       <span>{option}</span>
        <span className="text-sm px-2 py-1 bg-white bg-opacity-30 rounded-full">
          {votes} vote{votes !== 1 ? 's' : ''}
       </span>
    </button>
  )
}
