import { useState, useEffect } from "react";
import OptionButton from "./OptionButton";

export default function VotingBar({ options = [], eventId }) {
  const [pollOptions, setPollOptions] = useState([]);
  const [selectedVotes, setSelectedVotes] = useState({}); // Track selection state
  const [readyToVote, setReadyToVote] = useState({}); // Controls when voting is allowed

  // Function to merge duplicate locations and sum votes
  const mergeAndSortLocations = (options) => {
    const mergedOptions = {};

    options.forEach((option) => {
      const name = option.name.toLowerCase().trim(); // Normalize name
      if (!mergedOptions[name]) {
        mergedOptions[name] = { ...option, votes: option.votes || 1 };
      } else {
        mergedOptions[name].votes += option.votes || 1; // Sum votes for duplicates
      }
    });

    return Object.values(mergedOptions).sort((a, b) => b.votes - a.votes);
  };

  useEffect(() => {
    setPollOptions(mergeAndSortLocations(options));
  }, [options]);

  const updateAndSortVotes = (updatedOptions) => {
    const sortedOptions = [...updatedOptions].sort((a, b) => b.votes - a.votes);
    setPollOptions(sortedOptions);
  };

  const handleVoteToggle = (name) => {
    // If ready to vote, process the vote
    if (readyToVote[name]) {
      handleVote(name);
      setReadyToVote((prev) => ({ ...prev, [name]: false })); // Reset after voting
    } else {
      // Otherwise, just reset the color without voting
      setSelectedVotes((prev) => ({ ...prev, [name]: false }));
      setReadyToVote((prev) => ({ ...prev, [name]: true })); // Allow voting on next click
    }
  };

  const handleVote = async (name) => {
    const updatedOptions = pollOptions.map((option) =>
      option.name.toLowerCase().trim() === name.toLowerCase().trim()
        ? { ...option, votes: (option.votes || 1) + 1 }
        : option
    );

    setSelectedVotes((prev) => ({ ...prev, [name]: true })); // Mark as selected
    updateAndSortVotes(updatedOptions);

    try {
      await fetch(`http://localhost:5001/api/events/${eventId}/vote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locationName: name }),
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
          pollOptions.map((option, index) => {
            const isTopVoted = index === 0; // First item in sorted list
            const isSelected = selectedVotes[option.name] || false; // Check if selected

            return (
              <OptionButton
                key={index}
                option={(isTopVoted ? " ⭐ " : "") + option.name} // Add star emoji if highest vote
                votes={option.votes || 0}
                isSelected={isSelected} // Pass selection state to button
                onVote={() => handleVoteToggle(option.name)} // Click toggles first, then votes
              />
            );
          })
        ) : (
          <p className="text-gray-500">
            No locations added yet. Search for a location on the map and add it
            to the poll.
          </p>
        )}
      </div>
    </div>
  );
}
