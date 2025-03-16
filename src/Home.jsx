import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { TextField } from "@mui/material";
import { Box, Button } from "@mui/material";
import cheesecracker from "./assets/cheesecracker.png";
function Home() {
  const [eventName, setEventName] = useState("");
  const [selectedRange, setSelectedRange] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize the navigate function
  const [startTime, setStartTime] = useState(null); // null means no initial value
  const [endTime, setEndTime] = useState(null);
  const [showCalendar, setShowCalendar] = useState(true);
  const [clickedStates, setClickedStates] = useState(Array(7).fill(false));
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const handleCreateEvent = async () => {
    // You can show the alert here if needed before navigating, or just navigate

    if (
      !eventName ||
      !selectedRange ||
      !selectedRange.from ||
      !selectedRange.to
    ) {
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
        startTime: startTime.format("HH:mm"),
        endTime: endTime.format("HH:mm"),
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

  // Handle button click (Sun, Mon, Tue...)
  const handleDayClick = (index) => {
    const newClickedStates = [...clickedStates];
    newClickedStates[index] = !newClickedStates[index]; // Toggle clicked state
    setClickedStates(newClickedStates);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
        <div className="mt-10 max-w-2xl text-center bg-white p-8 rounded-2xl">
          <div className="flex items-center justify-center gap-2">
            <img src={cheesecracker} alt="logo" className="w-12 h-12" />
            <h1 className="text-5xl font-bold text-purple-600">SpotSync</h1>
          </div>
          <p className="text-gray-500 mt-1 text-sm">
            From plans to places in seconds 
          </p>
          <div className="mt-10 flex flex-col gap-4">
            <div className="flex flex-col items-start">
              {/* <p>Event name</p> */}
              <input
                type="text"
                placeholder="What is the meeting about?"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                className="p-3 border rounded-lg w-full text-lg"
              />
            </div>

            <div className="w-full flex justify-center">
              <div className="w-full flex">
                <button
                  className={`flex-1 px-4 py-2 rounded-l-lg transition-colors ${
                    showCalendar
                      ? "bg-purple-600 text-white"
                      : "bg-white text-purple-600 border border-purple-600"
                  }`}
                  onClick={() => setShowCalendar(true)}
                >
                  For one-time event
                </button>

                <button
                  className={`flex-1 px-4 py-2 rounded-r-lg transition-colors ${
                    !showCalendar
                      ? "bg-purple-600 text-white"
                      : "bg-white text-purple-600 border border-purple-600"
                  }`}
                  onClick={() => setShowCalendar(false)} // Hide calendar
                >
                  For recuring event
                </button>
              </div>
            </div>

            {showCalendar && (
              <div className="h-[320px] justify-center flex">
                <DayPicker
                  mode="range"
                  min={1}
                  selected={selectedRange} // Highlight the selected range
                  onSelect={handleDateSelect} // Handle date selection
                />
              </div>
            )}

            {!showCalendar && (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {days.map((day, index) => (
                    <Button
                      key={day}
                      variant={clickedStates[index] ? "outlined" : "contained"}
                      sx={{
                        flexShrink: 1,
                        borderRadius: 100, // Remove rounded corners
                        backgroundColor: clickedStates[index]
                          ? "#7f27fb"
                          : "transparent",
                        color: clickedStates[index] ? "#FFFFFF" : "#7f27fb",
                        borderColor: "#7f27fb",
                        "&:hover": {
                          backgroundColor: clickedStates[index]
                            ? "#4C288F"
                            : "#F3EFFF",

                          borderColor: "#4C288F",
                          boxShadow: 0,
                        },
                        boxShadow: 0,
                      }}
                      onClick={() => handleDayClick(index)} // Toggle clicked state
                    >
                      {day}
                    </Button>
                  ))}
                </Box>
              </Box>
            )}

            <div className="flex flex-col mt-6 text-left">
              <h1>Enter a time range</h1>
              <div className="flex flex-row gap-2">
                <TimePicker
                  label="Start"
                  value={startTime}
                  onChange={(newValue) => setStartTime(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  views={["hours"]}
                  className="w-1/2"
                />

                <TimePicker
                  label="End"
                  value={endTime}
                  onChange={(newValue) => setEndTime(newValue)}
                  renderInput={(params) => <TextField {...params} />}
                  views={["hours"]}
                  className="w-1/2"
                />
              </div>
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
            <p className="text-purple-900">
              Team CheeseHackers
            </p>
          </div>
        </div>
      </div>
    </LocalizationProvider>
  );
}

export default Home;
