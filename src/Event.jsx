import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Availability from "./Components/Availability/Availability.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx";
import AddPollOption from "./Components/AddPollOption.jsx";
import NameBox from "./Components/NameBox.jsx";
import CombinedAvailability from "./Components/CombinedAvailability";
import "./Event.css";
import { useNavigate } from "react-router-dom";

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
    setNameCompleted(true); // Clear input after submission

    localStorage.setItem(`rendezwho_user_${uniqueLink}`, userName);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const fetchEventData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/events/${uniqueLink}`
      );
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

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/confirmEvent"); // This will redirect to the /confirmEvent route
  };

  return (
    <div className="flex flex-col w-full gap-5">
      <h1 className="flex text-2xl font-bold text-white bg-violet-500 p-2">
        RendezWho
      </h1>
      <div className="flex flex-col items-center justify-center w-full">
        <div className="flex flex-col w-[90%] justify-center items-start p-3 gap-5">
          <div className="flex flex-col w-full">
            {eventData != null ? (
              <h2 className="text-5xl">{eventData.name}</h2>
            ) : (
              <p className="text-gray-500 mt-4 text-center text-2xl font-bold">
                Loading event details...
              </p>
            )}
            <div className="flex flex-row gap-3 opacity-90 p-2">
              {!nameCompleted ? (
                <div className="w-[210px] h-[30px] flex mt-2 bg-gray-100 rounded-md items-center justify-start">
                  <input
                    className="w-full pl-2 py-2 text-sm rounded-md text-gray-700"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    placeholder="Enter your name"
                  />
                  <button
                    className="w-[80px] h-full bg-violet-500 text-white rounded-md text-sm"
                    onClick={handleNameSubmit}
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <NameBox name={currentUser} />
                  <button
                    className="text-xs text-violet-500 underline hover:text-violet-700"
                    onClick={() => {
                      setNameCompleted(false);
                      localStorage.removeItem(`rendezwho_user_${uniqueLink}`);
                    }}
                  >
                    Change
                  </button>
                </div>
              )}
              {names
                .filter((name) => name !== currentUser)
                .map((n, index) => (
                  <NameBox key={index} name={n} />
                ))}
            </div>
          </div>

          <div className="flex flex-col flex-1 w-full md:flex-row gap-12 ">
            <div className="flex flex-2 md:w-1/3">
              {nameCompleted ? (
                <Availability eventId={uniqueLink} username={currentUser} />
              ) : (
                <div className="p-4 bg-gray-100 rounded shadow text-center">
                  Please enter your name to mark your availability
                </div>
              )}
            </div>
            <div className="flex-col flex-3 items-center justify-center w-full md:w-2/3 gap-4">
              <Map
                onLocationSelect={handleLocationSelect}
                
              />
              <AddPollOption 
                eventId={uniqueLink}
                selectedLocation={selectedLocation}
                onOptionAdded={fetchEventData} // Refresh poll options after adding
              />
              <VotingBar
                options={eventData?.pollOptions || []}
                eventId={uniqueLink}
              />
              <div className="mx-auto flex items-center justify-center mt-2 mb-6 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors w-64" onClick={handleClick}>
                Confirm Event
              </div>
            </div>
            
          </div>
          {/* CombinedAvailability section - add this below the calendar */}
          {nameCompleted && (
            <div className="w-[50] mt-8">
              <h3 className="text-xl font-semibold mb-4">Best Meeting Times</h3>
              <CombinedAvailability eventId={uniqueLink} />
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default Event;
