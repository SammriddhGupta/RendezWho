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
        <div className="mt-10 max-w-2xl text-center bg-white p-8 rounded-2xl shadow-lg">
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
                  Select Range
                </button>

                <button
                  className={`flex-1 px-4 py-2 rounded-r-lg transition-colors ${
                    !showCalendar
                      ? "bg-purple-600 text-white"
                      : "bg-white text-purple-600 border border-purple-600"
                  }`}
                  onClick={() => setShowCalendar(false)} // Hide calendar
                >
                  Days of Week
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
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap"}}>
                  {days.map((day, index) => (
                    <Button
                      key={day}
                      variant={clickedStates[index] ? "outlined" : "contained"}
                      sx={{
                        flexShrink: 1,
                        borderRadius: 0, // Remove rounded corners
                        backgroundColor: clickedStates[index] ? "transparent" : "#633BBC",
                        color: clickedStates[index] ? "#633BBC" : "#FFFFFF",
                        borderColor: "#633BBC",
                        "&:hover": {
                          backgroundColor: clickedStates[index] ? "#F3EFFF" : "#4C288F",
                        },
                      }}
                      onClick={() => handleDayClick(index)} // Toggle clicked state
                    >
                      {day}
                    </Button>
                  ))}
                </Box>
              </Box> 
            )}

            <h1>Enter a time range</h1>
            <TimePicker
              label="Start"
              value={startTime}
              onChange={(newValue) => setStartTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
              views={['hours']}
            />
      
            <TimePicker
              label="End"
              value={endTime}
              onChange={(newValue) => setEndTime(newValue)}
              renderInput={(params) => <TextField {...params} />}
              views={['hours']}
            />  
           
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
    </LocalizationProvider>
  );
}

export default Home;
