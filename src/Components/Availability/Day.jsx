import { useState } from "react";
import "./Day.css";

function Day({ height }) {
  const [hours, setHours] = useState(Array(48).fill(false));

  const [isMouseDown, setIsMouseDown] = useState(false);
  const [mouseState, setMouseState] = useState(false);

  const handleMouseDown = (index) => {
    // Update the hours state, setting the clicked index to true

    if (hours[index] === true) {
      setIsMouseDown(true);

      setMouseState(false);
      setHours(
        (prevHours) => prevHours.map((item, i) => (i === index ? false : item)) // Set specific index to false
      );
      //   console.log("Mouse is pressed down on index:", index);
    } else {
      setIsMouseDown(true);
      setMouseState(true);

      setHours(
        (prevHours) => prevHours.map((item, i) => (i === index ? true : item)) // Set specific index to true
      );
    }

    // console.log(`Mouse down on index ${index}`);
  };

  const handleMouseUp = (index) => {
    setIsMouseDown(false); // Set to false when mouse is releases

    console.log("Mouse is released");
  };

  const handleMouseEnter = (index) => {
    if (isMouseDown) {
      if (mouseState === true) {
        setHours(
          (prevHours) => prevHours.map((item, i) => (i === index ? true : item)) // Set specific index to true
        );
      } else if (mouseState === false) {
        setHours(
          (prevHours) =>
            prevHours.map((item, i) => (i === index ? false : item)) // Set specific index to false
        );
      }

      //   console.log(index);
    }
  };

  return (
    <div className="day-container">
      {hours.map((hour, index) => (
        <div
          onMouseDown={() => handleMouseDown(index)}
          onMouseUp={() => handleMouseUp(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          className="day-child"
          key={index}
          //   onClick={() => toggleHour(index)}
          style={{
            cursor: "pointer",
            backgroundColor: hour ? "green" : "gray",
            color: "black",
            // borderRadius: "5px",
            // border: "1px solid black",
            height: "15px",
            width: "60px",
            fontSize: "10px",
          }}
        >
          <div>{hour ? "True" : "False"}</div>
        </div>
      ))}
    </div>
  );
}

export default Day;
