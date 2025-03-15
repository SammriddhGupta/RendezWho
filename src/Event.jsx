import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Day from "./Components/Availability/Day.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx"
import NameBox from "./Components/NameBox.jsx";
import { useState } from "react";

function Event() {
  const [name, setName] = useState(["Alice", "Bob", "Charlie"]);

  //backend for fetching name data goes here



  ////////////////


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
      <h1 className="text-4xl font-tilt text-black bg-amber-300 text-center p-4">
        RendezWho
      </h1>
      <div className="min-h-screen flex gap-5 flex-col p-4 px-10 overflow-auto md:flex-row">
        <div className="flex-row gap-2 flex-1  md:flex-col">
          {name.map((n, index) => (
            <NameBox key={index} name={n} />
          ))}
        </div>

        <div className=" flex flex-1 w-full md:w-1/3">
          <Day />
        </div>

          <div className="flex flex-col items-center justify-center w-full md:w-2/3 gap-4">
            <Map />
            <VotingBar />
            </div>
      
      </div>
    </>
  );
}

export default Event;
