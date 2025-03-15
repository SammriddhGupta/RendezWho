import { useState } from 'react';

export default function OptionButton({ option }) {
  const [ isClicked, setIsClicked ] = useState(false);

  return (
    <button
      className={`flex items-center justify-center h-4 text-lg text-purple-500 font-semibold border-2 rounded-lg w-full p-3 py-5 ${isClicked ? "bg-purple-400 text-white border-purple-200" : "bg-purple-200 border-purple-400"}`}
      onClick={() => setIsClicked(!isClicked)}
    >
      {option}
    </button>
  )
}
