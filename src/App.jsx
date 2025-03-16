import { useState } from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Event from "./Event.jsx";
import ConfirmEvent from "./ConfirmEvent.jsx";

function App() {
  return (
    <>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/event/:uniqueLink" element={<Event />} />
          <Route path="/confirmEvent" element={<ConfirmEvent />} />
        </Routes>
      </div>
    </>
  );
}

export default App;