// server.js
import express from 'express';
import cors from 'cors';
import { collection, addDoc, doc, setDoc, getDoc, getDocs, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore';
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
    const { optionIndex } = req.body;
    if (optionIndex === undefined) {
      return res.status(400).json({ error: "Option index is required" });
    }

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

    // Create a new array with the updated vote count
    const updatedPollOptions = [...pollOptions];
    updatedPollOptions[optionIndex] = {
      ...updatedPollOptions[optionIndex],
      votes: (updatedPollOptions[optionIndex].votes || 0) + 1
    };

    // Update the document with the new poll options array
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
