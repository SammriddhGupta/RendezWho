import Day from "./Day"; // Assuming Day is the child component
import { useParams } from "react-router-dom";
import "./Availability.css";
import { useEffect, useState } from "react";

function Availability() {
  const addAvailability = async (eventId, availData) => {
    try {
      const response = await fetch(`/api/events/${eventId}/avail`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ avail: availData }), // Pass the availability data
      });

      const result = await response.json();
      if (response.ok) {
        console.log("Availability added:", result);
      } else {
        console.error("Error adding availability:", result.error);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

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

  function convertToISOString(timestamp) {
    // Convert seconds to milliseconds
    const milliseconds =
      timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);

    // Create a new Date object using the milliseconds
    const date = new Date(milliseconds);

    // Convert to ISO string
    return date.toISOString();
  }

  function getDaysBetween(startISO, endISO, startTime, endTime) {
    // Parse the ISO strings into Date objects
    const startDate = new Date(convertToISOString(startISO));
    const endDate = new Date(convertToISOString(endISO));

    const dateDict = {}; // Dictionary to store each day

    // Loop through every day between start and end date
    let currentDate = new Date(startDate);

    // Ensure the loop runs while the current date is on or before the end date
    while (currentDate <= endDate) {
      // Format the date as 'YYYY-MM-DD'
      const dateString = currentDate.toISOString().split("T")[0]; // e.g., "2025-03-16"

      // Add the formatted date to the dictionary with "hello" as the value
      dateDict[dateString] = Array(
        getHalfHourIntervals(startTime, endTime)
      ).fill(false);

      // Move to the next day
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }
    console.log(dateDict);
    return dateDict;
  }

  const { uniqueLink } = useParams();
  // const [eventData, setEventData] = useState(null);
  const [timeList, setTimeList] = useState(null);
  const [slots, setSlots] = useState(null);

  // const timeList = generateTimeList("09:00", "17:00", 1);
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
        // setEventData(data);
        setTimeList(generateTimeList(data.startTime, data.endTime, 1));
        setSlots(
          getDaysBetween(
            data.startDate,
            data.endDate,
            data.startTime,
            data.endTime
          )
        );
        console.log(`Data for the ${data.name} event is`, data);
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    };
    fetchEvent();
  }, [uniqueLink]);

  return (
    <div className="side">
      {/* {eventData && JSON.stringify(eventData.startDate)} */}

      <div className="time-container">
        {(timeList || []).map((time, index) => (
          <div key={index} className="time-item">
            {time}
          </div>
        ))}
      </div>
      {/* {console.log(slots)} */}
      <div className="scroll-container">
        <div className="avail-container">
          {/* Dynamically create a row for each date */}
          {slots ? (
            Object.keys(slots).map((date) => (
              <div key={date} className="column-container">
                {/* Display formatted date */}
                <div className="text">{getFormattedDates(date)}</div>

                <Day
                  hours={slots[date]} // Pass the specific day's slots
                  date={date} // Pass the date
                  toggleSlot={toggleSlot} // Pass the toggle function to change the state in the parent
                  object={slots}
                  event={addAvailability}
                  eventId={uniqueLink}
                />
              </div>
            ))
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default Availability;
