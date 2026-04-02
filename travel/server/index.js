const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, '../data/travels.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../public')));

// Serve frontend index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Serve admin page
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/admin.html'));
});

// Helper: Read data
async function readData() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { trips: [] };
  }
}

// Helper: Write data
async function writeData(data) {
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// ===== TRIP ROUTES =====

// GET all trips
app.get('/api/trips', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.trips);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trips' });
  }
});

// GET single trip
app.get('/api/trips/:id', async (req, res) => {
  try {
    const data = await readData();
    const trip = data.trips.find(t => t.id === parseInt(req.params.id));
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    res.json(trip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trip' });
  }
});

// POST create trip
app.post('/api/trips', async (req, res) => {
  try {
    const data = await readData();
    const newTrip = {
      id: data.trips.length > 0 ? Math.max(...data.trips.map(t => t.id)) + 1 : 1,
      ...req.body,
      createdAt: new Date().toISOString(),
      checkpoints: []
    };
    data.trips.push(newTrip);
    await writeData(data);
    res.status(201).json(newTrip);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create trip' });
  }
});

// PUT update trip
app.put('/api/trips/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.trips.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    data.trips[index] = { ...data.trips[index], ...req.body, id: parseInt(req.params.id) };
    await writeData(data);
    res.json(data.trips[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update trip' });
  }
});

// DELETE trip
app.delete('/api/trips/:id', async (req, res) => {
  try {
    const data = await readData();
    const index = data.trips.findIndex(t => t.id === parseInt(req.params.id));
    if (index === -1) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    data.trips.splice(index, 1);
    await writeData(data);
    res.json({ message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete trip' });
  }
});

// ===== CHECKPOINT ROUTES =====

// POST create checkpoint
app.post('/api/trips/:tripId/checkpoints', async (req, res) => {
  try {
    const data = await readData();
    const trip = data.trips.find(t => t.id === parseInt(req.params.tripId));
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const newCheckpoint = {
      id: trip.checkpoints.length > 0 ? Math.max(...trip.checkpoints.map(c => c.id)) + 1 : 1,
      ...req.body
    };
    trip.checkpoints.push(newCheckpoint);
    await writeData(data);
    res.status(201).json(newCheckpoint);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create checkpoint' });
  }
});

// PUT update checkpoint
app.put('/api/trips/:tripId/checkpoints/:checkpointId', async (req, res) => {
  try {
    const data = await readData();
    const trip = data.trips.find(t => t.id === parseInt(req.params.tripId));
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const index = trip.checkpoints.findIndex(c => c.id === parseInt(req.params.checkpointId));
    if (index === -1) {
      return res.status(404).json({ error: 'Checkpoint not found' });
    }
    trip.checkpoints[index] = { ...trip.checkpoints[index], ...req.body, id: parseInt(req.params.checkpointId) };
    await writeData(data);
    res.json(trip.checkpoints[index]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update checkpoint' });
  }
});

// DELETE checkpoint
app.delete('/api/trips/:tripId/checkpoints/:checkpointId', async (req, res) => {
  try {
    const data = await readData();
    const trip = data.trips.find(t => t.id === parseInt(req.params.tripId));
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }
    const index = trip.checkpoints.findIndex(c => c.id === parseInt(req.params.checkpointId));
    if (index === -1) {
      return res.status(404).json({ error: 'Checkpoint not found' });
    }
    trip.checkpoints.splice(index, 1);
    await writeData(data);
    res.json({ message: 'Checkpoint deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete checkpoint' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Travel journal server running on port ${PORT}`);
});
