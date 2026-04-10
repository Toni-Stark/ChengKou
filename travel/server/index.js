const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3002;
const DATA_FILE = path.join(__dirname, '../data/travels.json');
const UPLOADS_DIR = path.join(__dirname, '../public/uploads');

// Ensure uploads directory exists
const fsSync = require('fs');
if (!fsSync.existsSync(UPLOADS_DIR)) {
  fsSync.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter: function (req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('只支持图片和视频文件！'));
    }
  }
});

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

// ===== UPLOAD ROUTE =====

// POST upload file (image or video)
app.post('/api/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    const fileUrl = '/uploads/' + req.file.filename;
    res.json({ url: fileUrl, filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ error: '文件上传失败' });
  }
});

// POST upload multiple files
app.post('/api/upload-multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: '没有上传文件' });
    }
    const urls = req.files.map(file => '/uploads/' + file.filename);
    res.json({ urls: urls });
  } catch (error) {
    res.status(500).json({ error: '文件上传失败' });
  }
});

// Multer error handling middleware
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: '文件大小超过限制（最大50MB）' });
    }
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({ error: '上传字段名不正确' });
    }
    return res.status(400).json({ error: '文件上传错误: ' + err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message || '上传失败' });
  }
  next();
});

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
