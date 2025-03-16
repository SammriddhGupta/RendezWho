import React, { useState, useEffect } from 'react';

function CombinedAvailability({ eventId }) {
  const [combinedData, setCombinedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [topTimes, setTopTimes] = useState([]);

  // Helper function to format time slot index to readable time
  const formatTimeSlot = (index) => {
    // Assuming 9 AM start time and 30-minute intervals
    const hour = Math.floor(index / 2) + 9;
    const minute = (index % 2) * 30;
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minute === 0 ? '00' : minute} ${ampm}`;
  };

  // Helper function to format date strings
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  useEffect(() => {
    const fetchCombinedAvailability = async () => {
      if (!eventId) return;
      
      setLoading(true);
      try {
        const response = await fetch(`http://localhost:5001/api/events/${eventId}/combined-availability`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch combined availability');
        }
        
        const data = await response.json();
        setCombinedData(data);
        
        // Process the data to find top available times
        const allTimeSlots = [];
        
        // Convert the availability data to a flat array of time slots with their counts
        Object.entries(data.combinedAvailability).forEach(([date, slots]) => {
          slots.forEach((count, slotIndex) => {
            if (count > 0) {
              allTimeSlots.push({
                date,
                formattedDate: formatDate(date),
                timeSlot: slotIndex,
                formattedTime: formatTimeSlot(slotIndex),
                count,
                percentAvailable: Math.round((count / data.totalUsers) * 100)
              });
            }
          });
        });
        
        // Sort by count (highest first)
        allTimeSlots.sort((a, b) => b.count - a.count);
        
        // Take top 3 or fewer
        setTopTimes(allTimeSlots.slice(0, 3));
        
      } catch (err) {
        console.error('Error fetching combined availability:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCombinedAvailability();
  }, [eventId]);

  // If still loading
  if (loading) {
    return <div className="p-4">Loading combined availability...</div>;
  }

  // If there was an error
  if (error) {
    return (
      <div className="p-4 text-blue-500">
        Oops: {"No one has input their availabilties yet"}.
      </div>
    );
  }

  // If no data yet
  if (!combinedData || !topTimes.length) {
    return (
      <div className="p-4 bg-gray-100 rounded shadow">
        No availability data yet. Ask participants to add their free times.
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">Top Available Times</h3>
      <div className="space-y-3">
        {topTimes.map((time, index) => (
          <div 
            key={`${time.date}-${time.timeSlot}`}
            className="p-3 bg-purple-50 rounded border-l-4 border-purple-500"
          >
            <div className="flex justify-between items-center">
              <div>
                <span className="font-medium">{time.formattedDate}</span> at{' '}
                <span className="font-medium">{time.formattedTime}</span>
              </div>
              <div className="text-sm bg-purple-100 px-2 py-1 rounded">
                {time.count}/{combinedData.totalUsers} people ({time.percentAvailable}%)
              </div>
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-purple-600 h-2.5 rounded-full" 
                  style={{ width: `${time.percentAvailable}%` }}
                ></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-sm text-gray-600">
        <p>Total participants: {combinedData.totalUsers}</p>
        <p className="mt-1">
          Participants: {combinedData.participants.join(', ')}
        </p>
      </div>
    </div>
  );
}

export default CombinedAvailability;