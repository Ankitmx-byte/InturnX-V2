const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  modules: [{
    type: String
  }],
  category: {
    type: String,
    required: true
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  xpReward: {
    type: Number,
    default: 100
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Course', courseSchema);
