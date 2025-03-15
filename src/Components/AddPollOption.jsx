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
        body: JSON.stringify(selectedLocation),
      });
      if (!response.ok) {
        throw new Error("Failed to add poll option");
      }
      const data = await response.json();
      console.log("Poll option added:", data);
      if (onOptionAdded) onOptionAdded(selectedLocation);
    } catch (error) {
      console.error("Error adding poll option:", error);
      alert("Error adding poll option. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="mt-4 text-center">
      {selectedLocation && (
        <>
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
        </>
      )}
    </div>
  );
};

export default AddPollOption;
