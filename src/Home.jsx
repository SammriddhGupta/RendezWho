import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { isSameDay } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";

function Home() {
  const [eventName, setEventName] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  const handleCreateEvent = () => {
    // You can show the alert here if needed before navigating, or just navigate
    alert(`Event "${eventName}" Created!`);
    navigate("/event"); // Navigate to the "/event" page
  };

  const [value, setValue] = useState([]);

  const handleDayClick = (day, modifiers) => {
    const newValue = [...value];
    if (modifiers.selected) {
      const index = value.findIndex((d) => isSameDay(day, d));
      newValue.splice(index, 1);
    } else {
      newValue.push(day);
    }
    setValue(newValue);
  };

  const handleResetClick = () => setValue([]);

  let footer = <>Please pick one or more days.</>;

  if (value.length > 0)
    footer = (
      <>
        You selected {value.length} days.{" "}
        <button onClick={handleResetClick}>Reset</button>
      </>
  );

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
            <h1>Select Multiple Dates</h1>
            <DayPicker
              onDayClick={handleDayClick}
              modifiers={{ selected: value }}
              footer={footer}
            />
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
