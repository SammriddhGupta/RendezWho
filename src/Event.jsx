import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./index.css";
import Availability from "./Components/Availability/Availability.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx";
import NameBox from "./Components/NameBox.jsx";
import NameInput from "./Components/NameInput.jsx";
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
    <div className='flex flex-col w-full h-100%'>
      <h1 className="flex text-2xl font-bold text-white bg-violet-500 p-2">RendezWho</h1>
      <div className="flex flex-col ">

      </div>
      {eventData ? (
        <div className="flex flex-col p-3">
          <h2 className="text-5xl ">{eventData.name}</h2>
          <div className="flex flex-row gap-3 opacity-90">
            {name.map((n, index) => (
              <NameBox key={index} name={n} />
            ))}
          </div>
          {/* Can add more event details */}
        </div>
      ) : (
        <p className="text-gray-500 mt-4 text-center text-2xl font-bold">
          Loading event details...
        </p>
      )}
      <div className="min-h-screen flex gap-5 justify-center items-start flex-col p-4 px-10 overflow-auto md:flex-row">
        <div className="flex-col gap-2 flex-1  ">
          <div className="w-[150px] h-[30px] md:flex-row">
            {/* <div className="w-full h-full flex mt-2 bg-gray-100 rounded-md items-center justify-left">
              <input
                className="w-full pl-4 rounded-md text-gray-700"
                type="text"
                placeholder="your name"
              />
              <button className="w-20 h-8 bg-[#4379F2] text-white rounded-md text-sm">
                Add
              </button>
            </div> */}
          </div>
        </div>
        <div className=" flex flex-2 h-screen md:w-1/3">
          <Availability></Availability>
        </div>
        <div className="flex flex-3 flex-col items-center justify-center w-full gap-4">
          <div className="w-full h-[500px] rounded-lg">
            <Map />
          </div>
          {/* <div className="w-full h-[400px] ">
            <VotingBar />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default Event;
