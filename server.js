const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files from current directory

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  process.exit(1);
});

// Confession Schema
const confessionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String, // For rate limiting (optional)
});

const Confession = mongoose.model('Confession', confessionSchema);

// Routes
app.get('/api/confessions', async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ timestamp: -1 }).limit(50);
    res.json(confessions);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch confessions' });
  }
});

app.post('/api/confessions', async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Confession content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Confession must be less than 1000 characters' });
    }

    const confession = new Confession({
      content: content.trim(),
      ip: req.ip
    });

    await confession.save();
    res.status(201).json({ message: 'Confession submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit confession' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});