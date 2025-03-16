import { useState } from "react";
import "./index.css";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { Select, TextField, MenuItem, FormControl, InputLabel, Avatar, Box } from "@mui/material";
import dayjs from "dayjs";
import { v4 as uuidv4 } from "uuid";

function ConfirmEvent() {
  const navigate = useNavigate(); // Initialize the navigate function
  const [selectedStartTime, setSelectedStartTime] = useState(dayjs("2025-05-01T10:30"));
  const [selectedEndTime, setSelectedEndTime] = useState(dayjs("2025-05-01T20:30"));
  const [eventName] = useState("Group Meeting for Cheese Flavour");
  const [date] = useState("Saturday, Apr 14, 2025");
  const places = ["UNSW", "USYD", "UTS"];
  const [selectedPlace, setSelectedPlace] = useState(places[0]); // change to put top voted place.
  const [name, setName ] = useState(["Bob", "Tom", "Jerry", "Holly", "Sally", "Dylan"]);
  const [showButtons, setShowButtons] = useState(true);

  const handlePlaceChange = (event) => {
    setSelectedPlace(event.target.value);
  };

  const handleReject = () => {
    navigate(`/event/${data.uniqueLink}`);
  }

  const handleExport = () => {
    const eventStart = selectedStartTime.format("YYYYMMDDTHHmmss[Z]");
    const eventEnd = selectedEndTime.format("YYYYMMDDTHHmmss[Z]");
    const uid = uuidv4(); // Generate a unique ID
    const dtstamp = dayjs().format("YYYYMMDDTHHmmss[Z]"); // Current timestamp

    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Your Organization//NONSGML v1.0//EN
CALSCALE:GREGORIAN
BEGIN:VEVENT
UID:${uid}
DTSTAMP:${dtstamp}
SUMMARY:${eventName}
DESCRIPTION:${Array.isArray(name) ? name.join(", ") : name || "No description provided"}
DTSTART:${eventStart}
DTEND:${eventEnd}
LOCATION:${selectedPlace}
END:VEVENT
END:VCALENDAR`;

    // Create a Blob with the iCal content
    const blob = new Blob([icsContent], { type: "text/calendar" });

    // Trigger the download
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "event.ics";
    link.click();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100 p-6">
      <div className="mt-10 max-w-2xl text-center bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-4xl font-bold text-purple-600">{eventName}</h1>
        <p className="text-lg font-medium text-center text-gray-600 mt-2">
          {date}
        </p>

        <div className="mt-7 flex flex-col gap-6">
          <div className="flex gap-4">
              <TimePicker
                label="Start"
                value={selectedStartTime}
                onChange={(newValue) => setSelectedStartTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
                disabled={!showButtons}
              />
        
              <TimePicker
                label="End"
                value={selectedEndTime}
                onChange={(newValue) => setSelectedEndTime(newValue)}
                renderInput={(params) => <TextField {...params} />}
                disabled={!showButtons}
              />  
          </div>

          <FormControl fullWidth>
            <InputLabel id="dropdown-label">Confirm place</InputLabel>
            <Select
              labelId="dropdown-label"
              value={selectedPlace}
              label="Choose an option"
              onChange={handlePlaceChange}
              disabled={!showButtons}
            >
              {places.map((event) => (
                <MenuItem key={event} value={event}>
                  {event}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap", gap: 2 }}>
            {name.map((name, index) => {
              const initials = name
                .split(" ")
                .map((word) => word[0])
                .join("")
                .toUpperCase();

              return (
                <Avatar key={index} sx={{ bgcolor: getRandomColor(index) }}>
                  {initials}
                </Avatar>
              );
            })}
          </Box>

          {showButtons && (
            <div className="flex gap-4 justify-center">
              <button 
                className=" flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
                onClick={() => setShowButtons(false)}
              >
                Confirm
              </button>

              <button 
                className=" flex-1 text-purple-600 border border-purple-600 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-100"
                onClick={handleReject}
              >
                Reject
              </button>
            </div>
          )}

          {!showButtons && (
            <button 
              className=" flex-1 bg-purple-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-purple-700"
              onClick={() => {
                setShowButtons(false); // Hide buttons
                handleExport();        // Export the iCal file
              }}
            >
              Export
            </button>
          )}
        </div>
      </div>
    </div>
    </LocalizationProvider>
  );
}

// Helper function to generate random colors
function getRandomColor(index) {
  const colors = ["#633BBC", "#8B5CF6", "#EC4899", "#FBBF24", "#10B981", "#F97316"];
  return colors[index % colors.length];
}
  
export default ConfirmEvent;
  