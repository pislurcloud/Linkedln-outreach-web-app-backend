// models/Outreach.js
const mongoose = require('mongoose');

const outreachSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  company: {
    type: String,
    required: true,
  },
  jobTitle: {
    type: String,
    required: true,
  },
  connectionNote: {
    type: String,
    required: true,
    maxlength: 300,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
}, {
  timestamps: true, // adds createdAt, updatedAt
});

module.exports = mongoose.model('Outreach', outreachSchema);
