import "./index.css";
import Day from "./Components/Availability/Day.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx"
import NameBox from "./Components/NameBox.jsx";
import { useState } from "react";

function Event() {
  const [name, setName] = useState(["Alice", "Bob", "Charlie"]);
  
  return (
    <>
      <h1 className="text-4xl font-tilt text-black bg-amber-300 text-center p-4">
        RendezWho
      </h1>
      <div className="min-h-screen flex gap-5 flex-col p-4 px-10 overflow-auto md:flex-row">
        <div className="flex-col gap-2 flex-1">
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
    </div>
    </>
  );
}

export default Event;
