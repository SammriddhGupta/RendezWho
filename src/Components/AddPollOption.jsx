import { useState } from "react";

const AddPollOption = ({ eventId, selectedLocation, onOptionAdded }) => {
  const [loading, setLoading] = useState(false);

  const addOptionToPoll = async () => {
    if (!selectedLocation) {
      alert("No location selected.");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:5001/api/events/${eventId}/poll-options`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            name: selectedLocation.name,
            x: selectedLocation.x,
            y: selectedLocation.y,
            bounds: selectedLocation.bounds,
          }),
      });

      if (!response.ok) {
        throw new Error("Failed to add poll option");
      }

      const data = await response.json();
      console.log("Poll option added:", data);

      if (onOptionAdded) {
        onOptionAdded(selectedLocation);
      }
    } catch (error) {
      console.error("Error adding poll option:", error);
      alert("Error adding poll option. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 text-center w-full md:w-1/2">
      {selectedLocation ? (
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <p className="text-lg text-gray-700">
            Selected Location: <strong>{selectedLocation.name}</strong>
          </p>
          <button
            onClick={addOptionToPoll}
            className="mt-2 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Poll"}
          </button>
        </div>
      ) : (
        <div className="p-4 bg-white border-2 border-gray-200 rounded-xl">
          <p className="text-gray-500">Search for a location on the map to add it to the poll</p>
        </div>
      )}
    </div>
  );
};

export default AddPollOption;
