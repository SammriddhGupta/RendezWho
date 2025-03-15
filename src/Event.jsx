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
    <div className='flex flex-col w-full gap-5'>
      <h1 className="flex text-2xl font-bold text-white bg-violet-500 p-2">RendezWho</h1>
      <div className='flex flex-col items-center justify-center w-full'>
        <div className="flex flex-col w-[90%] justify-center items-start p-3 gap-5">
          <div className='flex flex-col w-full'>
            {eventData != null ? (
              <h2 className="text-5xl">{eventData.name}</h2>
            ) : (
              <p className="text-gray-500 mt-4 text-center text-2xl font-bold">
                Loading event details...
              </p>
            )}
            <div className="flex flex-row gap-3 opacity-90 p-2">
              {name.map((n, index) => (
                <NameBox key={index} name={n} />
              ))}
            </div>
          </div>
            
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex flex-2 md:w-1/3">
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
    </div>
  );
}

export default Event;
