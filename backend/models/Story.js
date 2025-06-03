const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  story: {
    type: String,
    required: true
  },
  audioUrl: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Story = mongoose.model('Story', storySchema);

module.exports = Story; 