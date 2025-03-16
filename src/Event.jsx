import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Availability from "./Components/Availability/Availability.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx"
import AddPollOption from "./Components/AddPollOption.jsx";
import NameBox from "./Components/NameBox.jsx";
import CombinedAvailability from "./Components/CombinedAvailability";
import { Pencil } from "lucide-react";

function Event() {
  const [names, setNames] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [nameCompleted, setNameCompleted] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [selectedLocation, setSelectedLocation] = useState(null);

  const { uniqueLink } = useParams();
  const [eventData, setEventData] = useState(null);

  // const [pollOptions, setPollOptions] = useState([]);  
  const handleNameSubmit = () => {
    if (inputValue.trim() === "") return; // Prevent empty submissions

    const userName = inputValue.trim();
    setNames((prevNames) => [...prevNames, inputValue]);
    setCurrentUser(userName); 
    console.log("Name submitted:", userName);
    setInputValue("");
    setNameCompleted(true) // Clear input after submission

    localStorage.setItem(`rendezwho_user_${uniqueLink}`, userName);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  }

  const fetchEventData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/events/${uniqueLink}`);
      const data = await response.json();
      setEventData(data);

      // Check if we have the participant names stored in the event data
      if (data.participants && Array.isArray(data.participants)) {
        setNames(data.participants);
      }

    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  useEffect(() => {
    fetchEventData();
    
    // Check if the user has already signed in for this event
    const savedUsername = localStorage.getItem(`rendezwho_user_${uniqueLink}`);
    if (savedUsername) {
      setCurrentUser(savedUsername);
      setNameCompleted(true);
    }
  }, [uniqueLink]);

  const handleLocationSelect = (location) => {
    console.log("Location selected in Event:", location);
    setSelectedLocation(location);
  };

  return (
    <div className="flex flex-col min-h-screen items-center bg-gray-50">
      <header className="w-full bg-violet-500 text-white text-2xl font-bold p-2 text-center">
        RendezWho
      </header>

      <main className="w-full max-w-8xl flex flex-col p-6 gap-6">
        {eventData != null ? (
          <h2 className="text-5xl items-start">{eventData.name}</h2>
        ) : (
          <p className="text-gray-500 mt-4 text-center text-2xl font-bold">
            Loading event details...
          </p>
        )}

        <div className="flex flex-wrap gap-3 items-start justify-start">
          {!nameCompleted ? (
            <div className="flex bg-gray-100 rounded-md p-2">
              <input
                className="w-48 pl-2 py-1 text-sm rounded-md text-gray-700 outline-none"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Enter your name"
              />
              <button
                className="ml-2 px-3 py-1 bg-violet-500 text-white rounded-md text-sm"
                onClick={handleNameSubmit}
              >
                Add
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-start gap-2">
              <NameBox name={currentUser} />
              <button
                className="text-xs flex p-2 rounded-2xl text-black hover:bg-purple-600"
                onClick={() => {
                  setNameCompleted(false);
                  localStorage.removeItem(`rendezwho_user_${uniqueLink}`);
                }}
              >
                <Pencil className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          )}
          {names
            .filter((name) => name !== currentUser)
            .map((n, index) => (
              <NameBox key={index} name={n} />
            ))}
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-6">
          <div className="md:col-span-1">
            <p>when?</p>
            {nameCompleted ? (
              <Availability eventId={uniqueLink} username={currentUser} />
            ) : (
              <div className="p-4 bg-gray-100 rounded-md text-center">
                Please enter your name to mark your availability
              </div>
            )}
          </div>

          <div className="md:col-span-1 flex flex-col gap-4">
            <p>where?</p>
            <Map
              onLocationSelect={handleLocationSelect}
              onOptionAdded={fetchEventData}
              eventId={uniqueLink}
              selectedLocation={selectedLocation}
              eventData={eventData}
            />
            <VotingBar
              options={eventData?.pollOptions || []}
              eventId={uniqueLink}
            />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4 ">
            <p>Ready to meet!</p>
            {/* CombinedAvailability section - add this below the calendar */}
            {nameCompleted && (
              <div className="w-full flex flex-col h-auto rounded-lg ">

                <CombinedAvailability eventId={uniqueLink} />
              </div>
            )}
            <div className="flex w-full h-[40px] mt-8 bg-purple-600 text-white rounded-4xl items-center justify-center">
              Share the meeting!
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Event;
