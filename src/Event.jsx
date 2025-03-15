import "./index.css";
import Day from "./Components/Availability/Day.jsx";
import Map from "./Components/Map.jsx";
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
        <div className="flex flex-col flex-1 w-full md:w-2/3 space-y-4  ">
          <div className="w-full h-[300px] md:h-[400px] lg:h-[500px]">
            <Map />
          </div>
          <div className="flex-1 flex items-center justify-center bg-amber-400 h-[400px] md:h-[600ox] lg:h-[800px] ">
            place holder
          </div>
        </div>
      </div>
    </>
  );
}

export default Event;
