import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


function Home() {
  const [eventName, setEventName] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleCreateEvent = async () => {
    // You can show the alert here if needed before navigating, or just navigate

    if (!eventName || !selectedRange || !selectedRange.from || !selectedRange.to) {
      alert("Please enter an event name and select a valid date range.");
      return;
    }

    setLoading(true);
    try {
      // Build the event data payload
      const eventData = {
        name: eventName,
        eventType: "date_range", // For a date range event. Use "fixed_days" if appropriate.
        startDate: selectedRange.from.toISOString(), // Convert dates to ISO format
        endDate: selectedRange.to.toISOString(),
        days: null, // Not used for date_range events
        startTime: "09:00", // Hard-coded time range for now
        endTime: "17:00",
      };

      // Send a POST request to your backend API
      const response = await fetch("http://localhost:5001/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error("Failed to create event");
      }

      const data = await response.json();
      console.log("Event created:", data);
      // Navigate to the event page using the unique link returned by the backend
      navigate(`/event/${data.uniqueLink}`);
    } catch (error) {
      console.error("Error creating event:", error);
      alert("Error creating event. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle date range selection
  const handleDateSelect = (range) => {
    if (!range || !range.from) {
      setSelectedRange(null); // Reset if no valid range is selected
    } else {
      setSelectedRange(range);
    }
  };

  return (
    <>
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

            <div>
            <h1>Select a date range</h1>
            <DayPicker 
              mode="range" 
              min={1}
              selected={selectedRange} // Highlight the selected range
              onSelect={handleDateSelect} // Handle date selection
            />

            <h1>Select a time range</h1>
            
      
            </div>

            <button
              className="bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700"
              onClick={handleCreateEvent} // Call handleCreateEvent function on click
              disabled={loading}
            >
              {loading ? "Creating event, please wait..." : "Create Event"}
            </button>
            {loading && (
              <p className="text-gray-500 mt-2">
                Redirecting to your event page...
              </p>
            )}
          </div>

          <div className="mt-6">
            <p className="text-gray-500">Some text here</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
