import Day from "./Components/Availability/Day.jsx";
import Map from "./Components/Map.jsx";

const Event = () => {
  return (
    <div className="flex items-center justify-center bg-gray-100 p-6 min-h-screen w-full">
      <div className="flex flex-col md:flex-row justify-center items-center w-9/10 gap-5 md:gap-10 bg-white rounded-lg p-5">
        <Day/>
        <Map />
      </div>
    </div>
  );
}

export default Event;
