import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Availability from "./Components/Availability/Availability.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx";
import NameBox from "./Components/NameBox.jsx";

function Event() {
  const [name, setName] = useState(["Alice", "Bob", "Charlie"]);

  //backend for fetching name data goes here

  ////////////////

  const { uniqueLink } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(
          `http://localhost:5001/api/events/${uniqueLink}`
        );
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();
        setEventData(data);
        console.log(`Data for the ${data.name} event is`, data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [uniqueLink]);

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

            <div className="flex flex-3 flex-col w-full gap-4">
              <Map />
              {/* <div className="w-full h-[400px] ">
                <VotingBar />
              </div> */}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default Event;
