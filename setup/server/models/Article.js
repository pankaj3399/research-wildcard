const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new Schema({
  title: String,
  authors: [String],
  abstract: String,
  publicationDate: Date,
  documentLink: String,
  documentType: {
    type: String,
    enum: ['pdf', 'xml', 'pubmed'],
    required: true
  },
  projects: [{
    type: Schema.Types.ObjectId,
    ref: 'Project'
  }],
  reviews: [{
    type: Schema.Types.ObjectId,
    ref: 'ReviewInstance'
  }]
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
