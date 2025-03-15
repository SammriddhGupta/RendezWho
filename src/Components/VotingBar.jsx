import { useState, useEffect } from 'react';
import OptionButton from './OptionButton';

export default function VotingBar({ options = [], eventId }) {
  const [pollOptions, setPollOptions] = useState(options);

  useEffect(() => {
    setPollOptions(options);
  }, [options]);

  const handleVote = async (index) => {
    const newOptions = [...pollOptions];
    newOptions[index].votes = (newOptions[index].votes || 0) + 1;
    setPollOptions(newOptions);
    
    try {
      await fetch(`http://localhost:5001/api/events/${eventId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ optionIndex: index }),
      });

    } catch(error) {
      console.error('Error voting:', error);
    }
    
  };


  return (
    <div className='flex flex-col items-center justify-center bg-white rounded-xl px-3 py-5 w-1/2 gap-3 border-2 border-gray-200'>
      <h3 className='text-xl font-semibold text-purple-600'>Preferred location</h3>
      <div className='flex flex-col items-center justify-center gap-3 w-[80%] p-1'>
      {pollOptions.length > 0 ? (
          pollOptions.map((option, index) => (
            <OptionButton 
              key={index} 
              option={option.name} 
              votes={option.votes || 0} 
              onVote={() => handleVote(index)}
            />
          ))
        ) : (
          <p className="text-gray-500">No locations added yet. Search for a location on the map and add it to the poll.</p>
        )}
      </div>
    </div>
  )
}