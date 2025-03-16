import { useState, useEffect } from "react";
import OptionButton from "./OptionButton";

export default function VotingBar({ options = [], eventId }) {
  const [pollOptions, setPollOptions] = useState([]);

  // Function to merge duplicate locations and sum votes
  const mergeDuplicateLocations = (options) => {
    const mergedOptions = {};

    options.forEach((option) => {
      const name = option.name.toLowerCase().trim(); // Normalize name
      if (!mergedOptions[name]) {
        mergedOptions[name] = { ...option, votes: option.votes || 1 };
      } else {
        mergedOptions[name].votes += option.votes || 1; // Sum votes for duplicates
      }
    });

    return Object.values(mergedOptions);
  };

  useEffect(() => {
    setPollOptions(mergeDuplicateLocations(options));
  }, [options]);

  const handleVote = async (name) => {
    const updatedOptions = pollOptions.map((option) =>
      option.name.toLowerCase().trim() === name.toLowerCase().trim()
        ? { ...option, votes: (option.votes || 1) + 1 }
        : option
    );

    setPollOptions(updatedOptions);

    try {
      await fetch(`http://localhost:5001/api/events/${eventId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: name }), // Send name instead of index
      });
    } catch (error) {
      console.error("Error voting:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white rounded-xl px-3 py-5 w-full gap-3 border-2 border-gray-200">
      <h3 className="text-xl font-semibold text-purple-600">
        Preferred Location
      </h3>
      <div className="flex flex-col items-center justify-center gap-3 w-[80%] p-1">
        {pollOptions.length > 0 ? (
          pollOptions.map((option, index) => (
            <OptionButton
              key={index}
              option={option.name}
              votes={option.votes || 1}
              onVote={() => handleVote(option.name)}
            />
          ))
        ) : (
          <p className="text-gray-500">
            No locations added yet. 
            Search for a location on the map and add it to the poll.
          </p>
        )}
      </div>
    </div>
  );
}
