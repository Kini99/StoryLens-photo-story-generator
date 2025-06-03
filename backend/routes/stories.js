const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { PythonShell } = require('python-shell');
const auth = require('../middleware/auth');
const Story = require('../models/Story');

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only .png, .jpg and .jpeg format allowed!'));
  }
});

// Create new story
router.post('/upload', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const imageUrl = `/uploads/${req.file.filename}`;
    
    // Generate story using Kosmos-2
    const options = {
      mode: 'text',
      pythonPath: 'python',
      pythonOptions: ['-u'],
      scriptPath: './scripts',
      args: [imageUrl, process.env.KOSMOS_API_KEY]
    };

    PythonShell.run('generate_story.py', options).then(async (results) => {
      const story = results[0];

      // Generate audio using XTTS-v2
      const audioOptions = {
        mode: 'text',
        pythonPath: 'python',
        pythonOptions: ['-u'],
        scriptPath: './scripts',
        args: [story, process.env.COQUI_API_KEY]
      };

      PythonShell.run('generate_audio.py', audioOptions).then(async (audioResults) => {
        const audioUrl = audioResults[0];

        // Save story to database
        const newStory = new Story({
          user: req.user._id,
          title: req.body.title || 'Untitled Story',
          imageUrl,
          story,
          audioUrl
        });

        await newStory.save();
        res.status(201).json(newStory);
      });
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating story' });
  }
});

// Get user's stories
router.get('/', auth, async (req, res) => {
  try {
    const stories = await Story.find({ user: req.user._id })
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stories' });
  }
});

// Get specific story
router.get('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching story' });
  }
});

// Delete story
router.delete('/:id', auth, async (req, res) => {
  try {
    const story = await Story.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    res.json({ message: 'Story deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting story' });
  }
});

module.exports = router; 