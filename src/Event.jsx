import { useState } from "react";
import "./index.css";
import Day from "./Components/Availability/Day.jsx";
function Event() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
        <div className="max-w-2xl text-center bg-white p-10 rounded-2xl shadow-lg">
          <h1 className="text-4xl font-bold text-purple-600">RendezWho</h1>
          {/* <p className="text-gray-700 mt-4 text-lg">Some sorta slogan</p> */}

          <Day></Day>
        </div>
      </div>
    </>
  );
}

export default Event;
