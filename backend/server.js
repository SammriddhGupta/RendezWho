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

// Start the Express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
