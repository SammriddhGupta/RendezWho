import React, { useState } from "react";
import "./Day.css";

function Day({ hours, date, toggleSlot }) {
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseState, setMouseState] = useState(false);

  const handleMouseDown = (index) => {
    // Set initial state when mouse button is pressed
    if (hours[index] === true) {
      setIsMouseDown(true);
      setMouseState(false);
      toggleSlot(date, index); // Toggle the state by passing date and index
    } else {
      setIsMouseDown(true);
      setMouseState(true);
      toggleSlot(date, index); // Toggle the state by passing date and index
    }
  };

  const handleMouseUp = () => {
    setIsMouseDown(false); // Set to false when mouse is released
  };

  const handleMouseEnter = (index) => {
    if (isMouseDown) {
      // Update the state based on whether the mouse is down
      if (mouseState === true) {
        toggleSlot(date, index); // Toggle the state to true
      } else if (mouseState === false) {
        toggleSlot(date, index); // Toggle the state to false
      }
    }
  };

  return (
    <div className="day-container">
      {hours.map((hour, index) => (
        <div
          key={index}
          onMouseDown={() => handleMouseDown(index)}
          onMouseUp={handleMouseUp}
          onMouseEnter={() => handleMouseEnter(index)}
          className="day-child"
          style={{
            cursor: "pointer",
            backgroundColor: hour ? "green" : "gray", // Toggle color based on slot value
            color: "black",
            height: "20px",
            width: "70px",
            fontSize: "9px",
          }}
        >
          {/* <div>{hour ? "True" : "False"}</div> */}
        </div>
      ))}
    </div>
  );
}

export default Day;
