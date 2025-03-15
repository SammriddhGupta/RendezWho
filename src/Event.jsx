import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Day from "./Components/Availability/Day.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx"

function Event() {
  const { uniqueLink } = useParams();
  const [eventData, setEventData] = useState(null);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await fetch(`http://localhost:5001/api/events/${uniqueLink}`);
        if (!response.ok) {
          throw new Error("Event not found");
        }
        const data = await response.json();
        setEventData(data);
        console.log(`Data for the ${data.name} event is`, data)
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [uniqueLink]);

  return (
    <>
       <h1 className="text-4xl font-bold text-purple-600 text-center mb-6 mt-6">
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
            <p className="text-gray-500 mt-4 text-center text-2xl font-bold">Loading event details...</p>
        )}
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
     
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 w-full max-w-7xl">
          <div className="w-full md:w-1/3">
            <Day />
          </div>

          <div className="flex flex-col items-center justify-center w-full md:w-2/3 gap-4">
            <Map />
            <VotingBar />
          </div>
        </div>
      
    </div>
    </>
  );
}

export default Event;
