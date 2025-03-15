import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Availability from "./Components/Availability/Availability.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx"
import AddPollOption from "./Components/AddPollOption.jsx";
import NameBox from "./Components/NameBox.jsx";

function Event() {
  const [name, setName] = useState(["Alice", "Bob", "Charlie"]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  // const [pollOptions, setPollOptions] = useState([]);
  const { uniqueLink } = useParams();
  const [eventData, setEventData] = useState(null);

  const fetchEventData = async () => {
    try {
      const response = await fetch(`http://localhost:5001/api/events/${uniqueLink}`);
      const data = await response.json();
      setEventData(data);
    } catch (error) {
      console.error("Error fetching event:", error);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);


  const handleLocationSelect = (location) => {
    console.log("Location selected in Event:", location);
    setSelectedLocation(location);
  };

  /* const handleOptionAdded = (addedOption) => {
    // Update the local state with the new option
    setPollOptions(prevOptions => [...prevOptions, { ...addedOption, votes: 0 }]);
    // Clear the selected location
    setSelectedLocation(null);
  }; */

  return (
    <>
      <h1 className="text-4xl font-tilt text-black bg-amber-300 text-center p-4">
        RendezWho
      </h1>
      {eventData ? (
        <div className="mt-6 text-center">
          <h2 className="text-purple-800 text-4xl font-bold">
            Event Name: {eventData.name}
          </h2>
          {/* Can add more event details */}
        </div>
      ) : (
        <p className="text-gray-500 mt-4 text-center text-2xl font-bold">
          Loading event details...
        </p>
      )}
      <div className="min-h-screen flex gap-5 flex-col p-4 px-10 overflow-auto md:flex-row">
        <div className="flex-row gap-2 flex-1  md:flex-col">
          {name.map((n, index) => (
            <NameBox key={index} name={n} />
          ))}
        </div>

        <div className=" flex flex-1 w-full md:w-1/3">
          <Availability></Availability>
        </div>

        <div className="flex flex-col items-center justify-center w-full md:w-2/3 gap-4">
          <Map onLocationSelect={handleLocationSelect} />
          <AddPollOption 
        eventId={uniqueLink}
        selectedLocation={selectedLocation}
        onOptionAdded={fetchEventData} // Refresh poll options after adding
      />
      <VotingBar 
        options={eventData?.pollOptions || []} 
        eventId={uniqueLink} 
      />
        </div>
      </div>
    </>
  );
}

export default Event;
