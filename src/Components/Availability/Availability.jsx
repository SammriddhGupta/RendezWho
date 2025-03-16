import React, { useState, useEffect } from "react";
import Day from "./Day"; // Assuming Day is the child component
import "./Availability.css";
import { useParams } from "react-router-dom";

function Availability({ eventId, username }) {
  const [slots, setSlots] = useState({});
  const [loading, setLoading] = useState(false);
  const [savingStatus, setSavingStatus] = useState("");
  const [eventData, setEventData] = useState(null);

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

  // const timeList = generateTimeList("09:00", "17:00", 1);
  const [timeList, setTimeList] = useState(null);

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
  function getDaysBetween(startISO, endISO, startTime, endTime) {
    function convertToISOString(timestamp) {
      // Convert seconds to milliseconds
      const milliseconds =
        timestamp.seconds * 1000 + Math.floor(timestamp.nanoseconds / 1000000);

      // Create a new Date object using the milliseconds
      const date = new Date(milliseconds);

      // Convert to ISO string
      return date.toISOString();
    }

    // Parse the ISO strings into Date objects (ensure they're in UTC)
    const startDate = new Date(convertToISOString(startISO));
    const endDate = new Date(convertToISOString(endISO));

    const dateDict = {}; // Dictionary to store each day

    // Ensure the startDate and endDate are in UTC with no time components affecting it
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    let currentDate = new Date(startDate);
    let lastDate = new Date(endDate);

    console.log("Start Date:", startDate.toISOString());
    console.log("End Date:", endDate.toISOString());

    // Ensure the loop runs while the current date is on or before the end date
    while (currentDate <= lastDate) {
      // Format the date as 'YYYY-MM-DD'
      const dateString = currentDate.toISOString().split("T")[0]; // e.g., "2025-03-16"
      console.log("Current Date:", currentDate.toISOString());

      // Add the formatted date to the dictionary with the appropriate intervals
      dateDict[dateString] = Array(
        getHalfHourIntervals(startTime, endTime)
      ).fill(false);

      // Move to the next day in UTC to avoid time zone issues
      currentDate.setUTCDate(currentDate.getUTCDate() + 1);
    }

    console.log("Dates Dictionary:", dateDict);
    return dateDict;
  }

  const { uniqueLink } = useParams();
  // const [x, setX] = useState(null);

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
        setEventData(data);
        setTimeList(generateTimeList(data.startTime, data.endTime, 1));
        // console.log(
        //   getDaysBetween(
        //     data.startDate,
        //     data.endDate,
        //     data.startTime,
        //     data.endTime
        //   )
        // );
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

  useEffect(() => {
    const fetchUserAvailability = async () => {
      if (!eventId || !username) return;

      try {
        const response = await fetch(
          `http://localhost:5001/api/events/${eventId}/availability/${username}`
        );

        if (response.ok) {
          const data = await response.json();

          if (data.availability) {
            setSlots(data.availability);
          } else {
            // Initialize with default empty slots if no data exists
            // initializeDefaultSlots();
          }
        } else {
          // If user doesn't have saved data yet, initialize default slots
          // initializeDefaultSlots();
        }
      } catch (error) {
        console.error("Error fetching user availability:", error);
        // initializeDefaultSlots();
      }
    };

    // const initializeDefaultSlots = () => {
    //   // Initialize with some default dates - in a real app, you'd get these from the event data
    //   console.log(x);
    //   setSlots({
    //     "2025-04-01T00:00:00.000Z": Array(
    //       getHalfHourIntervals("9:00", "19:00")
    //     ).fill(false),
    //     "2025-04-02T00:00:00.000Z": Array(
    //       getHalfHourIntervals("9:00", "19:00")
    //     ).fill(false),
    //     "2025-04-03T00:00:00.000Z": Array(
    //       getHalfHourIntervals("9:00", "19:00")
    //     ).fill(false),
    //     "2025-04-04T00:00:00.000Z": Array(
    //       getHalfHourIntervals("9:00", "19:00")
    //     ).fill(false),
    //     "2025-04-05T00:00:00.000Z": Array(
    //       getHalfHourIntervals("9:00", "19:00")
    //     ).fill(false),
    //     "2025-04-06T00:00:00.000Z": Array(
    //       getHalfHourIntervals("9:00", "19:00")
    //     ).fill(false),
    //   });
    // };

    fetchUserAvailability();
  }, [eventId, username]);

  const saveAvailability = async () => {
    if (!eventId || !username) {
      setSavingStatus("Missing event ID or username");
      return;
    }

    setLoading(true);
    setSavingStatus("Saving...");

    try {
      const response = await fetch(
        `http://localhost:5001/api/events/${eventId}/availability`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            availability: slots,
          }),
        }
      );

      if (response.ok) {
        setSavingStatus("Your availability has been saved!");
        setTimeout(() => setSavingStatus(""), 3000); // Clear message after 3 seconds
      } else {
        setSavingStatus("Failed to save. Please try again.");
      }
    } catch (error) {
      console.error("Error saving availability:", error);
      setSavingStatus("Error connecting to server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full">
      <div className="side">
        <div className="time-container">
          {/* {eventData && JSON.stringify(x)} */}
          {(timeList || []).map((time, index) => (
            <div key={index} className="time-item">
              {time}
            </div>
          ))}
        </div>
        <div className="grid-container">
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
      </div>

      {/* Save button and status message */}
      <div className="flex flex-col items-center mt-4 w-full">
        <button
          onClick={saveAvailability}
          disabled={loading}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors w-full max-w-xs"
        >
          {loading ? "Saving..." : "Save My Free Times"}
        </button>

        {savingStatus && (
          <p
            className={`mt-2 text-sm ${
              savingStatus.includes("Error") || savingStatus.includes("Failed")
                ? "text-red-500"
                : savingStatus === "Saving..."
                ? "text-gray-500"
                : "text-green-500"
            }`}
          >
            {savingStatus}
          </p>
        )}
      </div>
    </div>
  );
}

export default Availability;
