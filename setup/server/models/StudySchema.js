const mongoose = require('mongoose');
const studySchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true, 
    trim: true 
},
// array to store author names
  authors: [String], 
  abstract: String,
  publicationDate: Date,
  fullTextLink: String,
  inclusionStatus: {
    type: String,
    enum: ['included', 'excluded', 'pending'],
    default: 'pending'
  },
  reasonsForExclusion: [String],
  pubmedId: {
    type: String,
    unique: true,
    sparse: true
  },
  // Client note* Add other fields for study here as required
});

module.exports = mongoose.model('Study', studySchema);
