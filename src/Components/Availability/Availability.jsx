import React, { useState } from "react";
import Day from "./Day"; // Assuming Day is the child component
import "./Availability.css";
function ParentComponent() {
  function generateTimeList(startTime, endTime, interval = 1) {
    const times = [];

    // Helper function to format time in AM/PM format without minutes
    const formatAMPM = (date) => {
      let hours = date.getHours();
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // The hour '0' should be '12'
      return `${hours} ${ampm}`;
    };

    // Parse the start and end time into Date objects
    const start = new Date(`1970-01-01T${startTime}:00`);
    const end = new Date(`1970-01-01T${endTime}:00`);

    // Loop and increment time by interval (in hours)
    while (start <= end) {
      times.push(formatAMPM(start));
      start.setMinutes(start.getMinutes() + interval * 60); // Increment by interval (in minutes)
    }

    return times;
  }

  function formatDate(dateString) {
    const options = {
      weekday: "short", // Abbreviated weekday (e.g., "Tue")
      month: "short", // Abbreviated month (e.g., "Apr")
      day: "numeric", // Day of the month (e.g., 1)
    };

    const date = new Date(dateString);

    // Get formatted date and remove any commas
    const formattedDate = date.toLocaleDateString("en-GB", options);

    // Replace commas in the formatted date (if any)
    return formattedDate;
  }

  function getFormattedDates(startDate) {
    const startFormatted = formatDate(startDate);

    return startFormatted;
  }

  // Full state for multiple dates (e.g., 48 slots for each date)

  // Function to toggle the specific slot for a given date
  const toggleSlot = (date, index) => {
    setSlots((prevState) => ({
      ...prevState,
      [date]: prevState[date].map((slot, idx) =>
        idx === index ? !slot : slot
      ),
    }));
  };

  const timeList = generateTimeList("09:00", "17:00", 1);

  function getHalfHourIntervals(startTime, endTime) {
    // Helper function to convert time in HH:MM format to minutes
    function timeToMinutes(time) {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    }

    // Convert start and end times to minutes
    const startMinutes = timeToMinutes(startTime);
    const endMinutes = timeToMinutes(endTime);

    // Calculate the difference in minutes
    const diffMinutes = endMinutes - startMinutes;

    // Return the number of half-hour intervals
    return Math.floor(diffMinutes / 30);
  }

  const [slots, setSlots] = useState({
    "2025-04-01T00:00:00.000Z": Array(
      getHalfHourIntervals("9:00", "19:00")
    ).fill(false),
    "2025-04-02T00:00:00.000Z": Array(
      getHalfHourIntervals("9:00", "19:00")
    ).fill(false),
    "2025-04-03T00:00:00.000Z": Array(
      getHalfHourIntervals("9:00", "19:00")
    ).fill(false),
    "2025-04-04T00:00:00.000Z": Array(
      getHalfHourIntervals("9:00", "19:00")
    ).fill(false),
    "2025-04-05T00:00:00.000Z": Array(
      getHalfHourIntervals("9:00", "19:00")
    ).fill(false),
    "2025-04-06T00:00:00.000Z": Array(
      getHalfHourIntervals("9:00", "19:00")
    ).fill(false),
  });

  return (
    <div className="side">
      <div className="time-container">
        {timeList.map((time, index) => (
          <div key={index} className="time-item">
            {time}
          </div>
        ))}
      </div>
      {console.log(slots)}
      <div className="avail-container">
        {/* Dynamically create a row for each date */}
        {Object.keys(slots).map((date) => (
          <div key={date} className="column-container">
            {/* Display formatted date */}
            <div className="text">{getFormattedDates(date)}</div>

            <Day
              hours={slots[date]} // Pass the specific day's slots
              date={date} // Pass the date
              toggleSlot={toggleSlot} // Pass the toggle function to change the state in the parent
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default ParentComponent;
