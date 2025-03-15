import { useState } from 'react';
import "./index.css";

function App() {
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);
  const [createdEvent, setCreatedEvent] = useState(null);
  

  const handleCreateEvent = async () => {
    setLoading(true);
    try {
      // dummy data for testing
      const eventData = {
        name: eventName,
        eventType: "date_range", // or "fixed_days" or "date_range"
        startDate: "2025-04-01",
        endDate: "2025-04-02",
        startTime: "09:00",
        endTime: "17:00"
      };

      const eventData2 = {
        name: eventName,
        eventType: "fixed_days", // or "fixed_days" or "date_range"
        days: ["Monday", "Wednesday", "Friday"],
        startTime: "09:00",
        endTime: "17:00"
      };

      const response = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData2)
      });
      
      const data = await response.json();
      console.log("Event created:", data);
      setCreatedEvent(data);
    } catch (error) {
      console.error("Error creating event:", error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="max-w-2xl text-center bg-white p-10 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-purple-600">RendezWho</h1>
        <p className="text-gray-700 mt-4 text-lg">Some sorta slogan</p>

        <div className="mt-10 flex flex-col gap-4">
          <input
            type="text"
            placeholder="Enter Event Name"
            value={eventName}
            onChange={(e) => setEventName(e.target.value)}
            className="p-3 border rounded-lg w-full text-lg"
          />
          <button
            className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
            onClick={handleCreateEvent}
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Event"}
          </button>
        </div>

        {createdEvent && (
          <div className="mt-6">
            <p className="text-gray-500">
              Event created! Unique link: <strong>{createdEvent.uniqueLink}</strong>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
