// server.js
import express from "express";
import cors from "cors";
import {
  collection,
  addDoc,
  doc,
  setDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebaseConfig.js";

const app = express();
app.use(express.json());
app.use(cors());

// Example: Create a new event
app.post("/api/events", async (req, res) => {
  try {
    const { name, eventType, startDate, endDate, days, startTime, endTime } =
      req.body;
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
    const docRef = await addDoc(collection(db, "events"), eventData);
    // Optionally, update the document to include the generated ID as a field
    await setDoc(
      doc(db, "events", docRef.id),
      { uniqueLink: docRef.id },
      { merge: true }
    );
    res.status(201).json({ eventId: docRef.id, uniqueLink: docRef.id });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({ error: "Error creating event" });
  }
});

// Example: Get event details by ID
app.get("/api/events/:id", async (req, res) => {
  try {
    const eventRef = doc(db, "events", req.params.id);
    const eventSnap = await getDoc(eventRef);
    if (!eventSnap.exists()) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(eventSnap.data());
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ error: "Error fetching event" });
  }
});

// Example: List all events (for testing purposes)
app.get("/api/events", async (req, res) => {
  try {
    const querySnapshot = await getDocs(collection(db, "events"));
    const events = [];
    querySnapshot.forEach((doc) => events.push({ id: doc.id, ...doc.data() }));
    res.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({ error: "Error fetching events" });
  }
});

app.post("/api/events/:id/avail", async (req, res) => {
  try {
    const { avail } = req.body;

    const eventDoc = await getDoc(eventRef);
    const eventData = eventDoc.data();

    if (!eventData.avail) {
      // If avail doesn't exist, create it with the new option
      await updateDoc(eventRef, { avail: avail });
    } else {
      // If avail exists, append the new option
      const updatedOptions = [...eventData.avail, avail];
      await updateDoc(eventRef, {
        avail: updatedOptions,
      });
    }

    res.status(200).json({ message: "Availability added", option: newOption });
  } catch (error) {
    console.error("Error adding Availability:", error);
    res.status(500).json({ error: "Error adding Availability" });
  }
});

// Start the Express server
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`API Server is running on port ${PORT}`);
});
