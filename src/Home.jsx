import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";


function Home() {
  const [eventName, setEventName] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  const handleCreateEvent = () => {
    // You can show the alert here if needed before navigating, or just navigate
    alert(`Event "${eventName}" Created!`);
    navigate("/event"); // Navigate to the "/event" page
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
           
          <div className="flex">
            <div>
              <button
                className="bg-purple-600 text-white px-4 py-2 rounded-l-lg hover:bg-purple-700 transition-colors"
              >
                Select Range
              </button>

              <button
                className="bg-white text-purple-600 px-4 py-2 rounded-r-lg border border-purple-600 hover:bg-purple-50 transition-colors"
              >
                Days of Week
              </button>
            </div>
          </div>
          
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
            >
              Create Event
            </button>
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
