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
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/confessionbox')
.then(() => console.log('Connected to MongoDB'))
.catch(err => {
  console.error('MongoDB connection error:', err);
  // Don't exit - allow app to run in demo mode
});

// Comment Schema
const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Confession Schema
const confessionSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
    maxlength: 1000
  },
  category: {
    type: String,
    default: 'other',
    enum: ['love', 'school', 'work', 'family', 'secrets', 'other']
  },
  reactions: {
    like: { type: Number, default: 0 },
    support: { type: Number, default: 0 },
    pray: { type: Number, default: 0 },
    fire: { type: Number, default: 0 }
  },
  comments: [commentSchema],
  timestamp: {
    type: Date,
    default: Date.now
  },
  ip: String,
});

const Confession = mongoose.model('Confession', confessionSchema);

// Routes
app.get('/api/confessions', async (req, res) => {
  try {
    const confessions = await Confession.find().sort({ timestamp: -1 }).limit(100);
    res.json(confessions);
  } catch (error) {
    console.error('Error fetching confessions:', error);
    res.status(500).json({ error: 'Failed to fetch confessions' });
  }
});

app.post('/api/confessions', async (req, res) => {
  try {
    const { content, category } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({ error: 'Confession content is required' });
    }

    if (content.length > 1000) {
      return res.status(400).json({ error: 'Confession must be less than 1000 characters' });
    }

    const confession = new Confession({
      content: content.trim(),
      category: category || 'other',
      ip: req.ip
    });

    await confession.save();
    res.status(201).json(confession);
  } catch (error) {
    console.error('Error submitting confession:', error);
    res.status(500).json({ error: 'Failed to submit confession' });
  }
});

// Add reaction to confession
app.post('/api/confessions/:id/react', async (req, res) => {
  try {
    const { id } = req.params;
    const { reactionType, reactions } = req.body;

    if (!['like', 'support', 'pray', 'fire'].includes(reactionType)) {
      return res.status(400).json({ error: 'Invalid reaction type' });
    }

    const confession = await Confession.findById(id);
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Update reactions
    confession.reactions = reactions;
    await confession.save();

    res.json({ success: true, reactions: confession.reactions });
  } catch (error) {
    console.error('Error adding reaction:', error);
    res.status(500).json({ error: 'Failed to add reaction' });
  }
});

// Add comment to confession
app.post('/api/confessions/:id/comment', async (req, res) => {
  try {
    const { id } = req.params;
    const { comment, comments } = req.body;

    if (!comment || !comment.content || comment.content.trim().length === 0) {
      return res.status(400).json({ error: 'Comment content is required' });
    }

    if (comment.content.length > 500) {
      return res.status(400).json({ error: 'Comment must be less than 500 characters' });
    }

    const confession = await Confession.findById(id);
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    // Create new comment object with proper schema
    const newComment = {
      content: comment.content.trim(),
      timestamp: comment.timestamp || new Date()
    };

    // Push new comment to array
    confession.comments.push(newComment);
    await confession.save();

    res.json({ success: true, comments: confession.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Delete confession
app.delete('/api/confessions/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const confession = await Confession.findByIdAndDelete(id);
    
    if (!confession) {
      return res.status(404).json({ error: 'Confession not found' });
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error deleting confession:', error);
    res.status(500).json({ error: 'Failed to delete confession' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT} to see the app`);
});
