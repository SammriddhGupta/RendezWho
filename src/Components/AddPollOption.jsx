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
        const locationData = {
            display_name: selectedLocation.display_name,
            name: selectedLocation.name,
            x: selectedLocation.x,
            y: selectedLocation.y,
            bounds: selectedLocation.bounds
          };

        console.log("Sending poll option for eventId:", eventId, locationData);
        const response = await fetch(`http://localhost:5001/api/events/${eventId}/poll-options`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(locationData),
        });

      if (!response.ok) {
        throw new Error("Failed to add poll option");
      }

      const data = await response.json();
      console.log("Poll option added:", data);
      alert("Location added to poll!");

      if (onOptionAdded) {
        onOptionAdded(locationData);
      }
    } catch (error) {
      console.error("Error adding poll option:", error);
      alert("Error adding poll option. Please try again.");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={addOptionToPoll}
      className="mt-2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
      disabled={loading}
    >
      {loading ? "Adding..." : "Add to Poll"}
    </button>
  );
};

export default AddPollOption;
