// server.js
import express from 'express';
import cors from 'cors';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebaseConfig.js';

const app = express();
app.use(express.json());
app.use(cors());

// Example: Create a new event
app.post('/api/events', async (req, res) => {
  try {
    const { name, eventType, startDate, endDate, days, startTime, endTime } = req.body;
    const eventData = {
      name,
      eventType, // "date_range" or "fixed_days"
      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,
      days: days || null,
      startTime,
      endTime,
      createdAt: serverTimestamp(),
    };

    // Add the document to the 'events' collection with an auto-generated ID
    const docRef = await addDoc(collection(db, 'events'), eventData);
    // Optionally, update the document to include the generated ID as a field
    await setDoc(doc(db, 'events', docRef.id), { uniqueLink: docRef.id }, { merge: true });
    res.status(201).json({ eventId: docRef.id, uniqueLink: docRef.id });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Error creating event' });
  }
});

// Example: Get event details by ID
app.get('/api/events/:id', async (req, res) => {
  try {
    const eventRef = doc(db, 'events', req.params.id);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      return res.status(404).json({ error: 'Event not found' });
    }
    res.json(eventSnap.data());
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).json({ error: 'Error fetching event' });
  }
});

// Example: List all events (for testing purposes)
app.get('/api/events', async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, 'events'));
    const events = [];
    querySnapshot.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Error fetching events' });
  }
});

app.post('/api/events/:id/poll-options', async (req, res) => {
  try {
    const { display_name, name, x, y, bounds } = req.body;
    const eventRef = doc(db, 'events', req.params.id);

    const boundsObject = {
      northeast: bounds[0],
      southwest: bounds[1]
    };

    const newOption = {
      display_name,
      name,
      coordinates: { x, y },
      bounds: boundsObject,
      votes: 0,
      index: Date.now()
    };

    const eventDoc = await getDoc(eventRef);
    const eventData = eventDoc.data();

    if (!eventData.pollOptions) {
      // If pollOptions doesn't exist, create it with the new option
      await updateDoc(eventRef, { pollOptions: [newOption] });
    } else {
      // If pollOptions exists, append the new option
      const updatedOptions = [...eventData.pollOptions, newOption];
      await updateDoc(eventRef, {
        pollOptions: updatedOptions
      });
    }

    res.status(200).json({ message: "Location added to poll", option: newOption });
  } catch (error) {
    console.error('Error adding poll option:', error);
    res.status(500).json({ error: "Error adding location to poll" });
  }
});

app.post('/api/events/:id/vote', async (req, res) => {
  try {
    const { optionIndex } = req.body;
    const eventRef = doc(db, 'events', req.params.id);
    const eventSnap = await getDoc(eventRef);

    if (!eventSnap.exists()) {
      return res.status(404).json({ error: "Event not found" });
    }

    const eventData = eventSnap.data();
    const pollOptions = eventData.pollOptions || [];

    if (optionIndex < 0 || optionIndex >= pollOptions.length) {
      return res.status(400).json({ error: "Invalid option index" });
    }

    const updatedPollOptions = pollOptions.map((option, index) => 
      index === optionIndex ? 
      { ...option, votes: (option.votes || 0) + 1 } : 
      option
    );

    await updateDoc(eventRef, { pollOptions: updatedPollOptions });
    res.status(200).json({ message: "Vote recorded successfully" });
  } catch (error) {
    console.error('Error recording vote:', error);
    res.status(500).json({ error: "Error recording vote" });
  }
});

app.post('/api/events/:id/availability', async (req, res) => {
  try {
    const eventId = req.params.id;
    const { username, availability } = req.body;
    
    if (!username || !availability) {
      return res.status(400).json({ error: 'Username and availability are required' });
    }
    
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return res.status(404).json({ error: 'Event not found' });
    }

    const eventData = eventSnap.data();
    
    // Create the availability object for this user
    const userAvailability = {
      username,
      availability,
      updatedAt: Date.now()
    };
    
    // Check if event already has availability data
    if (!eventData.userAvailabilities) {
      // If not, create a new array with this user's availability
      await updateDoc(eventRef, {
        userAvailabilities: [userAvailability],
        participants: [username] // Add to participants list
      });
    } else {
      // Find if this user already has submitted availability
      const userIndex = eventData.userAvailabilities.findIndex(ua => ua.username === username);
      
      let updatedAvailabilities = [...eventData.userAvailabilities];
      let updatedParticipants = eventData.participants || [];
      
      // Add username to participants list if not already there
      if (!updatedParticipants.includes(username)) {
        updatedParticipants.push(username);
      }
      
      if (userIndex >= 0) {
        // Update existing user's availability
        updatedAvailabilities[userIndex] = userAvailability;
      } else {
        // Add new user's availability
        updatedAvailabilities.push(userAvailability);
      }
      
      // Update the document
      await updateDoc(eventRef, {
        userAvailabilities: updatedAvailabilities,
        participants: updatedParticipants
      });
    }
    
    res.status(200).json({ message: 'Availability saved successfully' });
  } catch (error) {
    console.error('Error saving availability:', error);
    res.status(500).json({ error: 'Error saving availability' });
  }
});

// Get user availability
app.get('/api/events/:id/availability/:username', async (req, res) => {
  try {
    const eventId = req.params.id;
    const username = req.params.username;
    
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const eventData = eventSnap.data();
    
    // If no availabilities exist yet
    if (!eventData.userAvailabilities) {
      return res.status(404).json({ error: 'No availability data found' });
    }
    
    // Find this user's availability
    const userAvailability = eventData.userAvailabilities.find(ua => ua.username === username);
    
    if (!userAvailability) {
      return res.status(404).json({ error: 'No availability found for this user' });
    }
    
    res.status(200).json(userAvailability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Error fetching availability' });
  }
});

// Get combined availability for all users
app.get('/api/events/:id/combined-availability', async (req, res) => {
  try {
    const eventId = req.params.id;
    
    const eventRef = doc(db, 'events', eventId);
    const eventSnap = await getDoc(eventRef);
    
    if (!eventSnap.exists()) {
      return res.status(404).json({ error: 'Event not found' });
    }
    
    const eventData = eventSnap.data();
    
    // If no availabilities exist yet
    if (!eventData.userAvailabilities || eventData.userAvailabilities.length === 0) {
      return res.status(404).json({ error: 'No availability data found' });
    }
    
    // Initialize combined availability object
    const combinedAvailability = {};
    
    // Go through each user's availability data
    eventData.userAvailabilities.forEach(userAvail => {
      const availability = userAvail.availability;
      
      // For each date in this user's availability
      Object.keys(availability).forEach(date => {
        // Initialize this date in combined availability if it doesn't exist
        if (!combinedAvailability[date]) {
          combinedAvailability[date] = Array(availability[date].length).fill(0);
        }
        
        // For each time slot, increment the count for each 'true' value
        availability[date].forEach((isAvailable, index) => {
          if (isAvailable) {
            combinedAvailability[date][index]++;
          }
        });
      });
    });
    
    res.status(200).json({
      combinedAvailability,
      totalUsers: eventData.userAvailabilities.length,
      participants: eventData.participants || []
    });
  } catch (error) {
    console.error('Error calculating combined availability:', error);
    res.status(500).json({ error: 'Error calculating combined availability' });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
