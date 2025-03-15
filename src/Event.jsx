import "./index.css";
import Day from "./Components/Availability/Day.jsx";
import Map from "./Components/Map.jsx";
import VotingBar from "./Components/VotingBar.jsx"

function Event() {
  return (
    <>
       <h1 className="text-4xl font-bold text-purple-600 text-center mb-6 mt-6">
        RendezWho
      </h1>
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
