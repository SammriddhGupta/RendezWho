import { useState } from "react";

const AddPollOption = ({ eventId, selectedLocation, onOptionAdded }) => {
  const [loading, setLoading] = useState(false);
  const [poolAdded, setPoolAdded] = useState(false);
  const [error, setError] = useState("");

  const addOptionToPoll = async () => {
    if (!selectedLocation) {
      setError("No location selected.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const locationData = {
        display_name: selectedLocation.display_name,
        name: selectedLocation.name,
        x: selectedLocation.x,
        y: selectedLocation.y,
        bounds: selectedLocation.bounds,
      };

      console.log("Sending poll option for eventId:", eventId, locationData);
      const response = await fetch(
        `http://localhost:5001/api/events/${eventId}/poll-options`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(locationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add poll option");
      }

      const data = await response.json();
      console.log("Poll option added:", data);

      setPoolAdded(true);
     

      if (onOptionAdded) {
        onOptionAdded(locationData);
      }
      
    } catch (error) {
      console.error("Error adding poll option:", error);
      setError("Error adding poll option. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      <button
        onClick={addOptionToPoll}
        className="mx-auto flex items-center justify-center mt-2 mb-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-64"
        disabled={loading}
      >
        {(loading) ? "Adding" : (poolAdded) ? "Add vote" : "Add to poll"}
      </button>
      {error && (
        <p className="text-red-500 text-center mt-2 text-sm">{error}</p>
      )}
    </>
  );
};

export default AddPollOption;
